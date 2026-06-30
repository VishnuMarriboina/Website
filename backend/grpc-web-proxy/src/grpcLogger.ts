"use strict";

/**
 * gRPC-Web proxy logger.
 * Objects are logged directly — fully expandable in Node.js inspector / terminal.
 * Disable: GRPC_LOG=false
 */

const LOG_ENABLED = process.env.GRPC_LOG !== "false";
const IS_DEV = process.env.NODE_ENV !== "production";

// ── Status codes ──────────────────────────────────────────────────────────────

const GRPC_STATUS: Record<number, string> = {
  0: "OK",
  1: "CANCELLED",
  2: "UNKNOWN",
  3: "INVALID_ARGUMENT",
  4: "DEADLINE_EXCEEDED",
  5: "NOT_FOUND",
  6: "ALREADY_EXISTS",
  7: "PERMISSION_DENIED",
  8: "RESOURCE_EXHAUSTED",
  9: "FAILED_PRECONDITION",
  10: "ABORTED",
  11: "OUT_OF_RANGE",
  12: "UNIMPLEMENTED",
  13: "INTERNAL",
  14: "UNAVAILABLE",
  15: "DATA_LOSS",
  16: "UNAUTHENTICATED",
};

// ── Sensitive field masking ───────────────────────────────────────────────────

const SENSITIVE_KEYS = new Set([
  "password",
  "passwordhash",
  "token",
  "refreshtoken",
  "accesstoken",
  "secret",
  "clientsecret",
  "authorization",
  "apikey",
  "api_key",
  "otp",
  "pin",
  "cvv",
  "cardnumber",
  "privatekey",
]);

function maskSensitive(
  obj: Record<string, unknown>,
  depth = 0,
): Record<string, unknown> {
  if (depth > 4) return obj;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase())) {
      out[k] = "***MASKED***";
    } else if (Array.isArray(v)) {
      out[k] = v.map((i) =>
        i && typeof i === "object"
          ? maskSensitive(i as Record<string, unknown>, depth + 1)
          : i,
      );
    } else if (v && typeof v === "object") {
      out[k] = maskSensitive(v as Record<string, unknown>, depth + 1);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function maskHeaders(
  raw: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const safe: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    const val = Array.isArray(v) ? v.join(", ") : (v ?? "");
    if (SENSITIVE_KEYS.has(k.toLowerCase()) && val) {
      safe[k] = val
        .replace(/^(Bearer\s+)\S+/i, "$1***MASKED***")
        .replace(/^(?!Bearer)\S{8,}$/, "***MASKED***");
    } else {
      safe[k] = val;
    }
  }
  return safe;
}

// ── Sanitize (masking only in production) ────────────────────────────────────

const sanitize = (v: Record<string, unknown>): Record<string, unknown> =>
  IS_DEV ? v : maskSensitive(v);

const sanitizeHeaders = (
  h: Record<string, string | string[] | undefined>,
): Record<string, string | string[] | undefined> | Record<string, string> =>
  IS_DEV ? h : maskHeaders(h);

// ── Utilities ─────────────────────────────────────────────────────────────────

export function generateProxyId(): string {
  return `prx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface RequestInfo {
  correlationId: string;
  clientIp?: string;
  service: string;
  rpcMethod: string;
  httpMethod: string;
  url: string;
  headers: Record<string, string | string[] | undefined>;
  payload: Record<string, unknown>;
}

export interface ResponseInfo {
  correlationId: string;
  service: string;
  rpcMethod: string;
  duration: number;
  body: Record<string, unknown>;
}

export interface ErrorInfo {
  correlationId: string;
  service: string;
  rpcMethod: string;
  duration: number;
  code: number;
  message: string;
  stack?: string;
}

// ── Log functions ─────────────────────────────────────────────────────────────

export function logRequest(info: RequestInfo): void {
  if (!LOG_ENABLED) return;

  const endpoint = `${info.service}/${info.rpcMethod}`;
  const timestamp = new Date().toISOString();

  console.group(`🚀 gRPC Request — ${endpoint}`);
  console.log("Correlation ID :", info.correlationId);
  console.log("Timestamp      :", timestamp);
  console.log("Client IP      :", info.clientIp ?? "unknown");
  console.log("Service        :", info.service);
  console.log("RPC Method     :", info.rpcMethod);
  console.log("Endpoint       :", endpoint);
  console.log("HTTP Method    :", info.httpMethod);
  console.log("Request        :", sanitize(info.payload));
  console.log("Headers");
  console.log(sanitizeHeaders(info.headers));
  console.groupEnd();
}

export function logResponse(info: ResponseInfo): void {
  if (!LOG_ENABLED) return;

  const endpoint = `${info.service}/${info.rpcMethod}`;

  console.group(`✅ gRPC Response — ${endpoint}`);
  console.log("Correlation ID :", info.correlationId);
  console.log("Service        :", info.service);
  console.log("RPC Method     :", info.rpcMethod);
  console.log("Endpoint       :", endpoint);
  console.log("Status Code    :", "0 OK");
  console.log("Duration       :", `${info.duration}ms`);
  console.log("Response       :", sanitize(info.body));
  console.groupEnd();
}

export function logError(info: ErrorInfo): void {
  if (!LOG_ENABLED) return;

  const endpoint = `${info.service}/${info.rpcMethod}`;
  const statusName = GRPC_STATUS[info.code] ?? "UNKNOWN";

  console.group(`❌ gRPC Error — ${endpoint}`);
  console.log("Correlation ID :", info.correlationId);
  console.log("Service        :", info.service);
  console.log("RPC Method     :", info.rpcMethod);
  console.log("Endpoint       :", endpoint);
  console.log("Status Code    :", `${info.code} ${statusName}`);
  console.log("Duration       :", `${info.duration}ms`);
  console.log("Error          :", info.message);
  if (IS_DEV && info.stack) console.log("Stack          :", info.stack);
  console.groupEnd();
}

export function logDecodeError(route: string): void {
  if (!LOG_ENABLED) return;

  console.group(`❌ Decode Error — ${route}`);
  console.log(
    "Error :",
    "Invalid request encoding — could not decode protobuf payload",
  );
  console.groupEnd();
}
