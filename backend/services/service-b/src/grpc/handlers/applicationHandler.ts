'use strict';

import * as grpc from '@grpc/grpc-js';
import jwt from 'jsonwebtoken';
import applicationService from '../../services/applicationService';
import { applicationToGrpc } from '../../utils';
import config from '../../config';
import {
  UnaryCall, UnaryCb, GrpcError,
  GetByIdReq, CreateApplicationReq, GetApplicationsReq, GetUserAppReq,
  UpdateApplicationStatusReq,
} from './types';

const mapError = (err: { statusCode?: number; message: string }): GrpcError => {
  const statusMap: Record<number, number> = {
    400: grpc.status.INVALID_ARGUMENT,
    401: grpc.status.UNAUTHENTICATED,
    403: grpc.status.PERMISSION_DENIED,
    404: grpc.status.NOT_FOUND,
    409: grpc.status.ALREADY_EXISTS,
    422: grpc.status.INVALID_ARGUMENT,
  };
  return {
    code:    (err.statusCode ? statusMap[err.statusCode] : undefined) ?? grpc.status.INTERNAL,
    details: err.message,
  };
};

const invalidArg = (msg: string): GrpcError => ({ code: grpc.status.INVALID_ARGUMENT, details: msg });

const extractToken = (call: UnaryCall<Record<string, unknown>>): { id: string; role: string } | null => {
  const authValues = call.metadata.get('authorization');
  const raw = authValues[0] as string | undefined;
  if (!raw) return null;
  const token = raw.replace(/^Bearer\s+/i, '');
  try {
    return jwt.verify(token, config.jwt.secret) as { id: string; role: string };
  } catch {
    return null;
  }
};

export const CreateApplication = async (
  call: UnaryCall<CreateApplicationReq>,
  callback: UnaryCb
): Promise<void> => {
  const decoded = extractToken(call as unknown as UnaryCall<Record<string, unknown>>);
  if (!decoded) {
    return callback({
      code:    grpc.status.UNAUTHENTICATED,
      details: 'Please login to apply for jobs.',
    } as grpc.ServiceError);
  }

  const userId = decoded.id;
  const { jobId, resumeUrl, coverLetter } = call.request;

  if (!jobId?.trim()) return callback(invalidArg('jobId is required') as grpc.ServiceError);

  try {
    const app = await applicationService.create({ userId, jobId: jobId.trim(), resumeUrl, coverLetter });
    callback(null, { success: true, message: 'Application submitted successfully', data: applicationToGrpc(app) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const GetApplicationById = async (
  call: UnaryCall<GetByIdReq>,
  callback: UnaryCb
): Promise<void> => {
  const decoded = extractToken(call as unknown as UnaryCall<Record<string, unknown>>);
  if (!decoded) {
    return callback({ code: grpc.status.UNAUTHENTICATED, details: 'Authorization required' } as grpc.ServiceError);
  }

  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);
  try {
    const app = await applicationService.getById(id.trim());
    callback(null, { success: true, message: 'Application retrieved', data: applicationToGrpc(app) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const GetApplications = async (
  call: UnaryCall<GetApplicationsReq>,
  callback: UnaryCb
): Promise<void> => {
  const decoded = extractToken(call as unknown as UnaryCall<Record<string, unknown>>);
  if (!decoded || decoded.role !== 'ADMIN') {
    return callback({ code: grpc.status.PERMISSION_DENIED, details: 'Admin access required' } as grpc.ServiceError);
  }

  try {
    const page              = call.request.page              > 0 ? call.request.page              : 1;
    const limit             = call.request.limit             > 0 ? call.request.limit             : 10;
    const applicationStatus = call.request.applicationStatus || '';

    const { data, total } = await applicationService.getAll({ page, limit, applicationStatus });
    const totalPages = Math.ceil(total / limit);
    callback(null, {
      success: true,
      message: 'Applications retrieved',
      data:    data.map(applicationToGrpc),
      meta:    { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const GetUserApplications = async (
  call: UnaryCall<GetUserAppReq>,
  callback: UnaryCb
): Promise<void> => {
  const decoded = extractToken(call as unknown as UnaryCall<Record<string, unknown>>);
  if (!decoded) {
    return callback({ code: grpc.status.UNAUTHENTICATED, details: 'Authorization required' } as grpc.ServiceError);
  }

  const userId = decoded.role === 'ADMIN' ? (call.request.userId || decoded.id) : decoded.id;
  if (!userId?.trim()) return callback(invalidArg('userId is required') as grpc.ServiceError);

  try {
    const page  = call.request.page  > 0 ? call.request.page  : 1;
    const limit = call.request.limit > 0 ? call.request.limit : 10;
    const { data, total } = await applicationService.getUserApplications(userId.trim(), page, limit);
    const totalPages = Math.ceil(total / limit);
    callback(null, {
      success: true,
      message: 'User applications retrieved',
      data:    data.map(applicationToGrpc),
      meta:    { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const GetJobApplications = async (
  call: UnaryCall<GetByIdReq>,
  callback: UnaryCb
): Promise<void> => {
  const decoded = extractToken(call as unknown as UnaryCall<Record<string, unknown>>);
  if (!decoded || decoded.role !== 'ADMIN') {
    return callback({ code: grpc.status.PERMISSION_DENIED, details: 'Admin access required' } as grpc.ServiceError);
  }

  const { id: jobId } = call.request;
  if (!jobId?.trim()) return callback(invalidArg('jobId is required') as grpc.ServiceError);
  try {
    const { data, total } = await applicationService.getJobApplications(jobId.trim());
    const page = 1; const limit = total || 1;
    const totalPages = 1;
    callback(null, {
      success: true,
      message: 'Job applications retrieved',
      data:    data.map(applicationToGrpc),
      meta:    { total, page, limit, totalPages, hasNext: false, hasPrev: false },
    });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const UpdateApplicationStatus = async (
  call: UnaryCall<UpdateApplicationStatusReq>,
  callback: UnaryCb
): Promise<void> => {
  const decoded = extractToken(call as unknown as UnaryCall<Record<string, unknown>>);
  if (!decoded || decoded.role !== 'ADMIN') {
    return callback({ code: grpc.status.PERMISSION_DENIED, details: 'Admin access required' } as grpc.ServiceError);
  }

  const { id, applicationStatus } = call.request;
  if (!id?.trim())                return callback(invalidArg('id is required') as grpc.ServiceError);
  if (!applicationStatus?.trim()) return callback(invalidArg('applicationStatus is required') as grpc.ServiceError);

  try {
    const app = await applicationService.updateStatus(id.trim(), applicationStatus.trim());
    callback(null, { success: true, message: `Application status updated to ${applicationStatus}`, data: applicationToGrpc(app) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const DeleteApplication = async (
  call: UnaryCall<GetByIdReq>,
  callback: UnaryCb
): Promise<void> => {
  const decoded = extractToken(call as unknown as UnaryCall<Record<string, unknown>>);
  if (!decoded || decoded.role !== 'ADMIN') {
    return callback({ code: grpc.status.PERMISSION_DENIED, details: 'Admin access required' } as grpc.ServiceError);
  }

  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);

  try {
    await applicationService.delete(id.trim());
    callback(null, { success: true, message: 'Application deleted successfully' });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};
