const envFlag = import.meta.env.VITE_GRPC_LOG as string | undefined;
export const GRPC_LOG_ENABLED =
  envFlag !== undefined
    ? envFlag !== "false"
    : import.meta.env.MODE !== "production";

// ── Sensitive field masking ───────────────────────────────────────────────────

const SENSITIVE = new Set([
  "password",
  "passwordhash",
  "confirmpassword",
  "token",
  "accesstoken",
  "refreshtoken",
  "idtoken",
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

export function maskSensitive(value: unknown, depth = 0): unknown {
  if (depth > 5 || value == null || typeof value !== "object") return value;
  if (Array.isArray(value))
    return value.map((v) => maskSensitive(v, depth + 1));
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>))
    out[k] = SENSITIVE.has(k.toLowerCase())
      ? "***MASKED***"
      : maskSensitive(v, depth + 1);
  return out;
}

const IS_DEV = import.meta.env.MODE !== "production";

// In dev: raw values. In prod: sensitive fields masked.
const sanitize = (v: unknown): unknown => (IS_DEV ? v : maskSensitive(v));

// ── Utilities ─────────────────────────────────────────────────────────────────

export function generateCorrelationId(): string {
  return `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

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

export function grpcStatusName(code: number): string {
  return GRPC_STATUS[code] ?? "UNKNOWN";
}

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface GrpcRequestLog {
  correlationId: string;
  service: string;
  method: string;
  endpoint: string;
  metadata: Record<string, string>;
  request: unknown;
  timestamp: string;
}

export interface GrpcResponseLog {
  correlationId: string;
  service: string;
  method: string;
  statusCode: number;
  response: unknown;
  durationMs: number;
}

export interface GrpcErrorLog {
  correlationId: string;
  service: string;
  method: string;
  statusCode: number;
  error: string;
  details?: unknown;
  durationMs: number;
}

// ── Log functions ─────────────────────────────────────────────────────────────

export function logGrpcRequest(info: GrpcRequestLog): void {
  if (!GRPC_LOG_ENABLED) return;

  console.groupCollapsed(`🚀 gRPC Request — ${info.endpoint}`);

  console.log("Correlation ID :", info.correlationId);
  console.log("Timestamp      :", info.timestamp);
  console.log("Service        :", info.service);
  console.log("RPC Method     :", info.method);
  console.log("Endpoint       :", info.endpoint);
  console.log("Request        :", sanitize(info.request));
  console.log("Metadata       :", sanitize(info.metadata));
  console.groupEnd();
}

export function logGrpcResponse(info: GrpcResponseLog): void {
  if (!GRPC_LOG_ENABLED) return;

  const statusName = grpcStatusName(info.statusCode);

  console.groupCollapsed(`✅ gRPC Response — ${info.service}/${info.method}`);
  console.log("Correlation ID :", info.correlationId);
  console.log("Service        :", info.service);
  console.log("RPC Method     :", info.method);
  console.log("Endpoint       :", `${info.service}/${info.method}`);
  console.log("Status Code    :", `${info.statusCode} ${statusName}`);
  console.log("Duration       :", `${info.durationMs}ms`);
  console.log("Response       :", sanitize(info.response));
  console.groupEnd();
}

export function logGrpcError(info: GrpcErrorLog): void {
  if (!GRPC_LOG_ENABLED) return;

  const statusName = grpcStatusName(info.statusCode);

  console.groupCollapsed(`❌ gRPC Error — ${info.service}/${info.method}`);
  console.log("Correlation ID :", info.correlationId);
  console.log("Service        :", info.service);
  console.log("RPC Method     :", info.method);
  console.log("Endpoint       :", `${info.service}/${info.method}`);
  console.log("Status Code    :", `${info.statusCode} ${statusName}`);
  console.log("Duration       :", `${info.durationMs}ms`);
  console.log("Error          :", info.error);
  if (info.details != null) console.log("Details", info.details);
  console.groupEnd();
}
