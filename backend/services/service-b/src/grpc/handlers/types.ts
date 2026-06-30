import * as grpc from '@grpc/grpc-js';

export type UnaryCall<Req = Record<string, unknown>> =
  grpc.ServerUnaryCall<Req, Record<string, unknown>>;

export type UnaryCb<Res = Record<string, unknown>> =
  grpc.sendUnaryData<Res>;

export interface GrpcError {
  code:    number;
  details: string;
}

export interface HealthCheckReq {}
export interface HealthCheckRes {
  status:    string;
  service:   string;
  timestamp: string;
}

export interface GetByIdReq     { id: string }
export interface GetAllReq      { page: number; limit: number; status: string; refId: string }
export interface CreateRecordReq { title: string; content: string; status: string; refId: string }
export interface UpdateRecordReq { id: string; title: string; content: string; status: string }
export interface DeleteRecordReq { id: string }

// ── Job ───────────────────────────────────────────────────────────────────────
export interface GetJobsReq  { page: number; limit: number; status: string; department: string; search: string }
export interface CreateJobReq { title: string; description: string; department: string; location: string; experienceRequired: string; salaryRange: string; status: string }
export interface UpdateJobReq { id: string; title: string; description: string; department: string; location: string; experienceRequired: string; salaryRange: string; status: string }

// ── Application ───────────────────────────────────────────────────────────────
export interface CreateApplicationReq         { userId: string; jobId: string; resumeUrl: string; coverLetter: string }
export interface GetApplicationsReq           { page: number; limit: number; applicationStatus: string }
export interface GetUserAppReq                { userId: string; page: number; limit: number }
export interface UpdateApplicationStatusReq   { id: string; applicationStatus: string }
export interface DeleteApplicationReq         { id: string }
