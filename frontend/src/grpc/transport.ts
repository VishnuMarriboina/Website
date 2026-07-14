import type protobuf from "protobufjs/light";
import type { GrpcFrame, TrailerStatus, GrpcError } from "./types";
import {
  generateCorrelationId,
  logGrpcRequest,
  logGrpcResponse,
  logGrpcError,
} from "./grpcLogger";
import { useAuthStore } from "../store/authStore";

const GRPC_WEB_URL =
  import.meta.env.VITE_GRPC_WEB_URL || "http://localhost:8080";

const GRPC_UNAUTHENTICATED = 16;

// RPCs that must never trigger a silent-refresh retry — refreshing on their
// own 401 would either loop (RefreshToken) or paper over a genuine bad-
// credentials response (Login/Register/AdminLogin).
const REFRESH_EXEMPT_METHODS = new Set([
  "Login",
  "Register",
  "AdminLogin",
  "RefreshToken",
]);

type RefreshHandler = () => Promise<void>;

let refreshHandler: RefreshHandler | null = null;
let refreshInFlight: Promise<void> | null = null;

// serviceAClient registers this once it exists, so transport.ts doesn't need
// to import it back (that would be circular — serviceAClient imports transport).
export function registerRefreshHandler(handler: RefreshHandler): void {
  refreshHandler = handler;
}

// ── Frame helpers ─────────────────────────────────────────────────────────────

function encodeRequestFrame(payload: Uint8Array): Uint8Array<ArrayBuffer> {
  const buf = new ArrayBuffer(5 + payload.length);
  const frame = new Uint8Array(buf);
  frame[0] = 0x00;
  new DataView(buf).setUint32(1, payload.length, false);
  frame.set(payload, 5);
  return frame;
}

function parseResponseFrames(buffer: ArrayBuffer): GrpcFrame[] {
  const view = new DataView(buffer);
  let offset = 0;
  const frames: GrpcFrame[] = [];

  while (offset < buffer.byteLength) {
    if (offset + 5 > buffer.byteLength) break;
    const flag = view.getUint8(offset);
    const length = view.getUint32(offset + 1, false);
    const data = new Uint8Array(buffer, offset + 5, length);
    frames.push({ flag, data });
    offset += 5 + length;
  }

  return frames;
}

function parseTrailerStatus(trailerBytes: Uint8Array): TrailerStatus {
  const text = new TextDecoder().decode(trailerBytes);
  const statusMatch = text.match(/grpc-status:(\d+)/);
  const messageMatch = text.match(/grpc-message:([^\r\n]*)/);
  return {
    code: statusMatch ? parseInt(statusMatch[1], 10) : 0,
    message: messageMatch ? decodeURIComponent(messageMatch[1]) : "",
  };
}

// ── Core gRPC-Web call ────────────────────────────────────────────────────────

async function performCall<T>(
  service: string,
  method: string,
  ReqType: protobuf.Type,
  ResType: protobuf.Type,
  request: unknown,
): Promise<T> {
  const correlationId = generateCorrelationId();
  const endpoint = `${service}/${method}`;
  const url = `${GRPC_WEB_URL}/${endpoint}`;
  const timestamp = new Date().toISOString();

  // Build headers (real ones for the fetch; redacted copy for logs)
  const token = useAuthStore.getState().token;
  const fetchHeaders: Record<string, string> = {
    "Content-Type": "application/grpc-web+proto",
    "X-Grpc-Web": "1",
    "x-correlation-id": correlationId,
  };
  if (token) fetchHeaders["Authorization"] = `Bearer ${token}`;

  logGrpcRequest({
    correlationId,
    service,
    method,
    endpoint,
    metadata: fetchHeaders,
    request,
    timestamp,
  });

  const reqMsg = ReqType.fromObject((request ?? {}) as Record<string, unknown>);
  const reqBytes = ReqType.encode(reqMsg).finish() as Uint8Array;
  const frameBytes = encodeRequestFrame(reqBytes);

  const startMs = performance.now();

  const response = await fetch(url, {
    method: "POST",
    headers: fetchHeaders,
    body: frameBytes,
  });

  const resHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    resHeaders[key] = value;
  });

  if (!response.ok) {
    const durationMs = Math.round(performance.now() - startMs);
    logGrpcError({
      correlationId,
      service,
      method,
      statusCode: response.status,
      error: `HTTP ${response.status} ${response.statusText}`,
      durationMs,
    });
    throw {
      code: response.status,
      message: `HTTP ${response.status}`,
    } satisfies GrpcError;
  }

  const buffer = await response.arrayBuffer();
  const frames = parseResponseFrames(buffer);

  let dataBytes: Uint8Array | null = null;
  let grpcStatus = 0;
  let grpcMessage = "";

  for (const frame of frames) {
    if (frame.flag === 0x00) {
      dataBytes = frame.data;
    } else if (frame.flag === 0x80) {
      const trailer = parseTrailerStatus(frame.data);
      grpcStatus = trailer.code;
      grpcMessage = trailer.message;
    }
  }

  const durationMs = Math.round(performance.now() - startMs);

  if (grpcStatus !== 0) {
    logGrpcError({
      correlationId,
      service,
      method,
      statusCode: grpcStatus,
      error: grpcMessage || "gRPC error",
      durationMs,
    });
    throw {
      code: grpcStatus,
      message: grpcMessage || "gRPC error",
    } satisfies GrpcError;
  }

  if (!dataBytes) {
    logGrpcError({
      correlationId,
      service,
      method,
      statusCode: 13,
      error: "Empty response from server",
      durationMs,
    });
    throw {
      code: 13,
      message: "Empty response from server",
    } satisfies GrpcError;
  }

  const resMsg = ResType.decode(dataBytes);
  const result = ResType.toObject(resMsg, {
    longs: Number,
    enums: String,
    defaults: true,
  }) as T;

  console.log("ResType", ResType);
  console.log("dataBytes", dataBytes);
  console.log("resMsg", resMsg);

  logGrpcResponse({
    correlationId,
    service,
    method,
    statusCode: 0,
    response: result,
    durationMs,
  });

  return result;
}

// Wraps performCall with a one-shot silent-refresh-and-retry: on a 401 from
// an access-token-guarded RPC, refresh the token (deduped across concurrent
// callers) and replay the request once. If refresh itself fails, the original
// 401 propagates so the existing QueryCache/MutationCache handler (main.tsx)
// clears the session and redirects to /login.
export async function grpcWebCall<T>(
  service: string,
  method: string,
  ReqType: protobuf.Type,
  ResType: protobuf.Type,
  request: unknown,
): Promise<T> {
  try {
    return await performCall<T>(service, method, ReqType, ResType, request);
  } catch (err) {
    const isUnauthenticated = (err as Partial<GrpcError> | null)?.code === GRPC_UNAUTHENTICATED;
    const canRetry =
      isUnauthenticated &&
      !!refreshHandler &&
      !REFRESH_EXEMPT_METHODS.has(method) &&
      !!useAuthStore.getState().refreshToken;

    if (!canRetry) throw err;

    try {
      if (!refreshInFlight) {
        refreshInFlight = refreshHandler!().finally(() => {
          refreshInFlight = null;
        });
      }
      await refreshInFlight;
    } catch {
      throw err;
    }

    return performCall<T>(service, method, ReqType, ResType, request);
  }
}
