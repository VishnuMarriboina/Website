'use strict';

import * as grpc from '@grpc/grpc-js';
import recordService from '../../services/recordService';
import { recordToGrpc } from '../../utils';
import {
  UnaryCall, UnaryCb, GrpcError,
  HealthCheckReq, HealthCheckRes,
  GetByIdReq, GetAllReq, CreateRecordReq, UpdateRecordReq, DeleteRecordReq,
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

export const HealthCheck = (
  _call: UnaryCall<HealthCheckReq>,
  callback: UnaryCb<HealthCheckRes>
): void =>
  callback(null, { status: 'ok', service: 'service-b', timestamp: new Date().toISOString() });

export const GetById = async (
  call: UnaryCall<GetByIdReq>,
  callback: UnaryCb
): Promise<void> => {
  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);
  try {
    const record = await recordService.getById(id.trim());
    callback(null, { success: true, message: 'Record retrieved', data: recordToGrpc(record) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const GetAll = async (
  call: UnaryCall<GetAllReq>,
  callback: UnaryCb
): Promise<void> => {
  try {
    const page   = call.request.page  > 0 ? call.request.page  : 1;
    const limit  = call.request.limit > 0 ? call.request.limit : 10;
    const status = call.request.status || '';
    const refId  = call.request.refId  || '';

    const { data, total } = await recordService.getAll({ page, limit, status, refId });
    const totalPages = Math.ceil(total / limit);
    callback(null, {
      success: true,
      message: 'Records retrieved',
      data:    data.map(recordToGrpc),
      meta:    { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const Create = async (
  call: UnaryCall<CreateRecordReq>,
  callback: UnaryCb
): Promise<void> => {
  const { title, content, status, refId } = call.request;
  if (!title?.trim())   return callback(invalidArg('title is required') as grpc.ServiceError);
  if (!content?.trim()) return callback(invalidArg('content is required') as grpc.ServiceError);
  try {
    const record = await recordService.create({ title: title.trim(), content: content.trim(), status, refId });
    callback(null, { success: true, message: 'Record created', data: recordToGrpc(record) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const Update = async (
  call: UnaryCall<UpdateRecordReq>,
  callback: UnaryCb
): Promise<void> => {
  const { id, title, content, status } = call.request;
  if (!id?.trim())    return callback(invalidArg('id is required') as grpc.ServiceError);
  if (!title?.trim()) return callback(invalidArg('title is required') as grpc.ServiceError);
  try {
    const record = await recordService.update(id.trim(), { title: title.trim(), content, status });
    callback(null, { success: true, message: 'Record updated', data: recordToGrpc(record) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const Delete = async (
  call: UnaryCall<DeleteRecordReq>,
  callback: UnaryCb
): Promise<void> => {
  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);
  try {
    await recordService.delete(id.trim());
    callback(null, { success: true, message: 'Record deleted' });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};
