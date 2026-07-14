import * as grpc from '@grpc/grpc-js';
import * as ServiceB from '../../generated/service-b';

export type UnaryCall<Req = Record<string, unknown>> =
  grpc.ServerUnaryCall<Req, Record<string, unknown>>;

export type UnaryCb<Res = Record<string, unknown>> =
  grpc.sendUnaryData<Res>;

export interface GrpcError {
  code:    number;
  details: string;
}

// ── Request / response shapes — sourced from the generated proto types so
//    they can't drift from backend/proto/service-b.proto. Names are kept
//    as-is so handler files don't need to change their imports. ────────────

export type HealthCheckReq = ServiceB.HealthCheckRequest;
export type HealthCheckRes = ServiceB.HealthCheckResponse;

export type GetByIdReq      = ServiceB.GetByIdRequest;
export type GetAllReq       = ServiceB.GetAllRequest;
export type CreateRecordReq = ServiceB.CreateRecordRequest;
export type UpdateRecordReq = ServiceB.UpdateRecordRequest;
export type DeleteRecordReq = ServiceB.DeleteRecordRequest;

// ── Job ───────────────────────────────────────────────────────────────────────
export type GetJobsReq   = ServiceB.GetJobsRequest;
export type CreateJobReq = ServiceB.CreateJobRequest;
export type UpdateJobReq = ServiceB.UpdateJobRequest;

// ── Application ───────────────────────────────────────────────────────────────
export type CreateApplicationReq       = ServiceB.CreateApplicationRequest;
export type GetApplicationsReq         = ServiceB.GetApplicationsRequest;
export type GetUserAppReq              = ServiceB.GetUserAppRequest;
export type UpdateApplicationStatusReq = ServiceB.UpdateApplicationStatusRequest;
// DeleteApplication rpc reuses GetByIdRequest on the wire (see service-b.proto).
export type DeleteApplicationReq       = ServiceB.GetByIdRequest;
