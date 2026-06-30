/** Low-level wire-protocol types for the gRPC-Web transport layer. */

export interface GrpcError {
  code: number;
  message: string;
}

export interface GrpcFrame {
  flag: number;
  data: Uint8Array;
}

export interface TrailerStatus {
  code: number;
  message: string;
}

/** Shared domain types that appear in both service A and service B responses. */

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  timestamp: string;
}

export interface StatusResponse {
  success: boolean;
  message: string;
}
