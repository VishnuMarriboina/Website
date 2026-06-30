'use strict';

import * as grpc from '@grpc/grpc-js';
import jwt from 'jsonwebtoken';
import jobService from '../../services/jobService';
import { jobToGrpc } from '../../utils';
import config from '../../config';
import {
  UnaryCall, UnaryCb, GrpcError,
  GetByIdReq, GetJobsReq, CreateJobReq, UpdateJobReq, DeleteRecordReq,
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

const requireAdmin = (call: UnaryCall<Record<string, unknown>>, callback: UnaryCb): boolean => {
  const authValues = call.metadata.get('authorization');
  const raw = authValues[0] as string | undefined;
  if (!raw) {
    callback({ code: grpc.status.UNAUTHENTICATED, details: 'Missing or invalid authorization token' } as grpc.ServiceError);
    return false;
  }
  const token = raw.replace(/^Bearer\s+/i, '');
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { role: string };
    if (decoded.role !== 'ADMIN') {
      callback({ code: grpc.status.PERMISSION_DENIED, details: 'Admin access required' } as grpc.ServiceError);
      return false;
    }
    return true;
  } catch {
    callback({ code: grpc.status.UNAUTHENTICATED, details: 'Invalid authorization token' } as grpc.ServiceError);
    return false;
  }
};

export const GetJobs = async (
  call: UnaryCall<GetJobsReq>,
  callback: UnaryCb
): Promise<void> => {
  try {
    const page       = call.request.page       > 0 ? call.request.page       : 1;
    const limit      = call.request.limit      > 0 ? call.request.limit      : 10;
    const status     = call.request.status     || '';
    const department = call.request.department || '';
    const search     = call.request.search     || '';

    const { data, total } = await jobService.getAll({ page, limit, status, department, search });
    const totalPages = Math.ceil(total / limit);
    callback(null, {
      success: true,
      message: 'Jobs retrieved successfully',
      data:    data.map(jobToGrpc),
      meta:    { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const GetJobById = async (
  call: UnaryCall<GetByIdReq>,
  callback: UnaryCb
): Promise<void> => {
  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);
  try {
    const job = await jobService.getById(id.trim());
    callback(null, { success: true, message: 'Job retrieved successfully', data: jobToGrpc(job) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const CreateJob = async (
  call: UnaryCall<CreateJobReq>,
  callback: UnaryCb
): Promise<void> => {
  if (!requireAdmin(call as unknown as UnaryCall<Record<string, unknown>>, callback)) return;

  const { title, description, department, location, experienceRequired, salaryRange, status } = call.request;
  if (!title?.trim()) return callback(invalidArg('title is required') as grpc.ServiceError);

  try {
    const job = await jobService.create({ title: title.trim(), description, department, location, experienceRequired, salaryRange, status });
    callback(null, { success: true, message: 'Job created successfully', data: jobToGrpc(job) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const UpdateJob = async (
  call: UnaryCall<UpdateJobReq>,
  callback: UnaryCb
): Promise<void> => {
  if (!requireAdmin(call as unknown as UnaryCall<Record<string, unknown>>, callback)) return;

  const { id, title, description, department, location, experienceRequired, salaryRange, status } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);

  try {
    const payload: Record<string, unknown> = {};
    if (title              !== undefined) payload['title']              = title;
    if (description        !== undefined) payload['description']        = description;
    if (department         !== undefined) payload['department']         = department;
    if (location           !== undefined) payload['location']           = location;
    if (experienceRequired !== undefined) payload['experienceRequired'] = experienceRequired;
    if (salaryRange        !== undefined) payload['salaryRange']        = salaryRange;
    if (status             !== undefined) payload['status']             = status;

    const job = await jobService.update(id.trim(), payload);
    callback(null, { success: true, message: 'Job updated successfully', data: jobToGrpc(job) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const DeleteJob = async (
  call: UnaryCall<DeleteRecordReq>,
  callback: UnaryCb
): Promise<void> => {
  if (!requireAdmin(call as unknown as UnaryCall<Record<string, unknown>>, callback)) return;

  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);
  try {
    await jobService.delete(id.trim());
    callback(null, { success: true, message: 'Job deleted successfully' });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const ActivateJob = async (
  call: UnaryCall<GetByIdReq>,
  callback: UnaryCb
): Promise<void> => {
  if (!requireAdmin(call as unknown as UnaryCall<Record<string, unknown>>, callback)) return;

  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);
  try {
    const job = await jobService.activate(id.trim());
    callback(null, { success: true, message: 'Job activated successfully', data: jobToGrpc(job) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const DeactivateJob = async (
  call: UnaryCall<GetByIdReq>,
  callback: UnaryCb
): Promise<void> => {
  if (!requireAdmin(call as unknown as UnaryCall<Record<string, unknown>>, callback)) return;

  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);
  try {
    const job = await jobService.deactivate(id.trim());
    callback(null, { success: true, message: 'Job deactivated successfully', data: jobToGrpc(job) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};
