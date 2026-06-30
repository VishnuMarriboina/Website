'use strict';

/**
 * Server-side gRPC interceptor for service-a.
 * Wrap every handler with applyLogging() to get structured request/response logs.
 *
 * Disable:  GRPC_LOG=false   (env var)
 * Stack traces shown only when NODE_ENV !== 'production'
 */

import * as grpc from '@grpc/grpc-js';

// ── Configuration ─────────────────────────────────────────────────────────────

const LOG_ENABLED = process.env.GRPC_LOG !== 'false';
const IS_DEV      = process.env.NODE_ENV !== 'production';
const SERVICE     = 'servicea.ServiceA';

// ── ANSI helpers ──────────────────────────────────────────────────────────────

const C = {
  reset:     '\x1b[0m',
  bold:      '\x1b[1m',
  dim:       '\x1b[2m',
  white:     '\x1b[97m',
  gray:      '\x1b[90m',
  cyan:      '\x1b[96m',
  green:     '\x1b[92m',
  yellow:    '\x1b[93m',
  red:       '\x1b[91m',
  magenta:   '\x1b[95m',
  bgMagenta: '\x1b[45m',
  bgGreen:   '\x1b[42m',
  bgRed:     '\x1b[41m',
  bgYellow:  '\x1b[43m',
};

const pill = (bg: string, text: string): string =>
  `${C.bold}${bg}${C.white} ${text} ${C.reset}`;

// ── Box drawing ───────────────────────────────────────────────────────────────

const LINE_W = 72;
const dbl    = () => '═'.repeat(LINE_W);
const thin   = () => '─'.repeat(LINE_W);

function section(label: string, value: string, labelColor = C.gray, valueColor = C.white): string {
  const lStr = `${labelColor}${C.bold}${label.padEnd(14)}${C.reset}`;
  return `  ${lStr}${valueColor}${value}${C.reset}`;
}

function fmtJson(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 2)
      .replace(/\n/g, `\n  ${''.padEnd(14)}`);
  } catch {
    return String(obj);
  }
}

// ── Sensitive field masking ───────────────────────────────────────────────────

const SENSITIVE_KEYS = new Set([
  'password', 'passwordhash', 'token', 'refreshtoken', 'accesstoken',
  'secret', 'clientsecret', 'authorization', 'apikey', 'api_key',
  'otp', 'pin', 'cvv', 'cardnumber', 'privatekey',
]);

function maskSensitive(obj: Record<string, unknown>, depth = 0): Record<string, unknown> {
  if (depth > 4) return obj;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase())) {
      out[k] = '***MASKED***';
    } else if (Array.isArray(v)) {
      out[k] = v.length > 10 ? `[Array(${v.length})]` : v.map(i =>
        i && typeof i === 'object' ? maskSensitive(i as Record<string, unknown>, depth + 1) : i,
      );
    } else if (v && typeof v === 'object') {
      out[k] = maskSensitive(v as Record<string, unknown>, depth + 1);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function maskMetadata(meta: Record<string, string | Buffer | (string | Buffer)[]>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(meta)) {
    const val = Array.isArray(v) ? v[0]?.toString() ?? '' : v?.toString() ?? '';
    if (SENSITIVE_KEYS.has(k.toLowerCase()) && val) {
      out[k] = val.replace(/^(Bearer\s+)\S+/i, '$1***MASKED***').replace(/^(?!Bearer)\S{8,}$/, '***MASKED***');
    } else {
      out[k] = val;
    }
  }
  return out;
}

// ── gRPC status names ─────────────────────────────────────────────────────────

const GRPC_STATUS: Record<number, string> = {
  0: 'OK', 1: 'CANCELLED', 2: 'UNKNOWN', 3: 'INVALID_ARGUMENT',
  4: 'DEADLINE_EXCEEDED', 5: 'NOT_FOUND', 6: 'ALREADY_EXISTS',
  7: 'PERMISSION_DENIED', 8: 'RESOURCE_EXHAUSTED', 9: 'FAILED_PRECONDITION',
  10: 'ABORTED', 11: 'OUT_OF_RANGE', 12: 'UNIMPLEMENTED', 13: 'INTERNAL',
  14: 'UNAVAILABLE', 15: 'DATA_LOSS', 16: 'UNAUTHENTICATED',
};

function grpcStatusName(code: number): string {
  return GRPC_STATUS[code] ?? 'UNKNOWN';
}

// ── ID generator ──────────────────────────────────────────────────────────────

function generateServerId(): string {
  return `svc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── Internal log functions ────────────────────────────────────────────────────

function logIncomingRequest(opts: {
  correlationId: string;
  clientIp:      string;
  method:        string;
  metadata:      Record<string, string | Buffer | (string | Buffer)[]>;
  payload:       Record<string, unknown>;
}): void {
  if (!LOG_ENABLED) return;
  const endpoint  = `${SERVICE}/${opts.method}`;
  const timestamp = new Date().toISOString();
  const lines = [
    '',
    `  ${C.gray}${dbl()}${C.reset}`,
    `  ${pill(C.bgMagenta, '📨 Incoming Request')}  ${C.bold}${C.white}${endpoint}${C.reset}  ${C.dim}[${opts.correlationId}]${C.reset}`,
    `  ${C.gray}${dbl()}${C.reset}`,
    section('Timestamp',  timestamp,                              C.gray, C.dim),
    section('Client IP',  opts.clientIp,                         C.gray, C.cyan),
    section('Service',    SERVICE,                               C.gray, C.white),
    section('RPC Method', opts.method,                           C.gray, C.white),
    section('Endpoint',   endpoint,                              C.gray, C.cyan),
    section('Metadata',   fmtJson(maskMetadata(opts.metadata)),  C.gray, C.dim),
    section('Request',    fmtJson(maskSensitive(opts.payload)), C.gray, C.white),
    `  ${C.gray}${dbl()}${C.reset}`,
    '',
  ];
  process.stdout.write(lines.join('\n') + '\n');
}

function logOutgoingResponse(opts: {
  correlationId: string;
  method:        string;
  duration:      number;
  response:      Record<string, unknown>;
}): void {
  if (!LOG_ENABLED) return;
  const endpoint = `${SERVICE}/${opts.method}`;
  const lines = [
    '',
    `  ${C.gray}${dbl()}${C.reset}`,
    `  ${pill(C.bgGreen, '📤 Outgoing Response')}  ${C.bold}${C.white}${endpoint}${C.reset}  ${C.dim}[${opts.correlationId}]${C.reset}`,
    `  ${C.gray}${thin()}${C.reset}`,
    section('Status Code', `${C.green}gRPC OK (0)${C.reset}`,                   C.gray, ''),
    section('Duration',    `${C.green}${opts.duration}ms${C.reset}`,            C.gray, ''),
    section('Response',    fmtJson(maskSensitive(opts.response)),               C.gray, C.dim),
    `  ${C.gray}${dbl()}${C.reset}`,
    '',
  ];
  process.stdout.write(lines.join('\n') + '\n');
}

function logHandlerError(opts: {
  correlationId: string;
  method:        string;
  duration:      number;
  code:          number;
  message:       string;
  stack?:        string;
}): void {
  if (!LOG_ENABLED) return;
  const endpoint   = `${SERVICE}/${opts.method}`;
  const statusName = grpcStatusName(opts.code);
  const lines = [
    '',
    `  ${C.gray}${dbl()}${C.reset}`,
    `  ${pill(C.bgRed, '❌ Handler Error')}  ${C.bold}${C.white}${endpoint}${C.reset}  ${C.dim}[${opts.correlationId}]${C.reset}`,
    `  ${C.gray}${thin()}${C.reset}`,
    section('Status Code', `${C.red}gRPC ${statusName} (${opts.code})${C.reset}`, C.gray, ''),
    section('Duration',    `${C.red}${opts.duration}ms${C.reset}`,               C.gray, ''),
    section('Error',       `${C.red}${opts.message}${C.reset}`,                  C.gray, ''),
    ...(IS_DEV && opts.stack
      ? [section('Stack', `${C.dim}${opts.stack.split('\n').slice(0, 8).join(`\n  ${''.padEnd(14)}`)}${C.reset}`, C.gray, '')]
      : []
    ),
    `  ${C.gray}${dbl()}${C.reset}`,
    '',
  ];
  process.stdout.write(lines.join('\n') + '\n');
}

// ── Handler types ─────────────────────────────────────────────────────────────

type AnyCall     = grpc.ServerUnaryCall<Record<string, unknown>, Record<string, unknown>>;
type AnyCallback = grpc.sendUnaryData<Record<string, unknown>>;
type AnyHandler  = (call: AnyCall, callback: AnyCallback) => void | Promise<void>;

// ── Handler wrapper ───────────────────────────────────────────────────────────

function wrapHandler(method: string, handler: AnyHandler): AnyHandler {
  return function wrappedHandler(call: AnyCall, callback: AnyCallback): void {
    const rawCorr = call.metadata.get('x-correlation-id')[0];
    const correlationId = (typeof rawCorr === 'string' ? rawCorr : rawCorr?.toString()) || generateServerId();
    const clientIp      = call.getPeer() || 'unknown';
    const startMs       = Date.now();
    const metaMap       = call.metadata.getMap() as Record<string, string | Buffer | (string | Buffer)[]>;

    logIncomingRequest({
      correlationId,
      clientIp,
      method,
      metadata: metaMap,
      payload:  call.request,
    });

    const wrappedCallback: AnyCallback = (err, value, trailer, flags) => {
      const duration = Date.now() - startMs;
      if (err) {
        const e         = err as Error & { code?: number };
        const errCode   = (err as grpc.ServiceError).code ?? grpc.status.INTERNAL;
        const errMsg    = (err as grpc.ServiceError).details || e.message || 'Internal error';
        logHandlerError({
          correlationId,
          method,
          duration,
          code:    errCode,
          message: errMsg,
          stack:   IS_DEV ? e.stack : undefined,
        });
      } else {
        logOutgoingResponse({
          correlationId,
          method,
          duration,
          response: (value ?? {}) as Record<string, unknown>,
        });
      }
      callback(err, value, trailer, flags);
    };

    try {
      const result = handler(call, wrappedCallback);
      if (result instanceof Promise) {
        result.catch((thrown: unknown) => {
          const e       = thrown as Error & { code?: number };
          const duration = Date.now() - startMs;
          logHandlerError({
            correlationId,
            method,
            duration,
            code:    e.code ?? grpc.status.INTERNAL,
            message: e.message || 'Unhandled rejection',
            stack:   IS_DEV ? e.stack : undefined,
          });
          callback(
            { code: e.code ?? grpc.status.INTERNAL, details: e.message } as grpc.ServiceError,
          );
        });
      }
    } catch (thrown: unknown) {
      const e        = thrown as Error & { code?: number };
      const duration = Date.now() - startMs;
      logHandlerError({
        correlationId,
        method,
        duration,
        code:    e.code ?? grpc.status.INTERNAL,
        message: e.message || 'Synchronous throw',
        stack:   IS_DEV ? e.stack : undefined,
      });
      callback(
        { code: e.code ?? grpc.status.INTERNAL, details: e.message } as grpc.ServiceError,
      );
    }
  };
}

// ── Public: apply logging to an entire service implementation ─────────────────

export function applyLogging(
  impl: grpc.UntypedServiceImplementation,
): grpc.UntypedServiceImplementation {
  const wrapped: grpc.UntypedServiceImplementation = {};
  for (const [method, handler] of Object.entries(impl)) {
    wrapped[method] = wrapHandler(method, handler as unknown as AnyHandler) as grpc.UntypedHandleCall;
  }
  return wrapped;
}
