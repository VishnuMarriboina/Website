export type Environment = 'development' | 'production' | 'test' | 'staging';
export type ItemStatus  = 'active' | 'inactive' | 'draft' | 'archived';

export interface HttpStatusMap {
  OK: 200; CREATED: 201; ACCEPTED: 202; NO_CONTENT: 204;
  BAD_REQUEST: 400; UNAUTHORIZED: 401; FORBIDDEN: 403; NOT_FOUND: 404;
  METHOD_NOT_ALLOWED: 405; CONFLICT: 409; UNPROCESSABLE: 422; TOO_MANY_REQUESTS: 429;
  INTERNAL_SERVER: 500; NOT_IMPLEMENTED: 501; SERVICE_UNAVAILABLE: 503; GATEWAY_TIMEOUT: 504;
}

export interface GrpcStatusMap {
  OK: 0; CANCELLED: 1; UNKNOWN: 2; INVALID_ARGUMENT: 3; DEADLINE_EXCEEDED: 4;
  NOT_FOUND: 5; ALREADY_EXISTS: 6; PERMISSION_DENIED: 7; INTERNAL: 13;
  UNAVAILABLE: 14; UNAUTHENTICATED: 16;
}

export interface PaginationDefaults {
  DEFAULT_PAGE: number;
  DEFAULT_LIMIT: number;
  MAX_LIMIT: number;
}

export interface TokenDefaults {
  ACCESS_EXPIRY: string;
  REFRESH_EXPIRY: string;
}

export interface CacheDefaults {
  SHORT_TTL: number;
  DEFAULT_TTL: number;
  LONG_TTL: number;
}
