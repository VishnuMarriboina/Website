'use strict';

import * as grpc from '@grpc/grpc-js';
import itemService from '../../services/itemService';
import { itemToGrpc } from '../../utils';
import {
  UnaryCall, UnaryCb, GrpcError,
  HealthCheckReq, HealthCheckRes,
  GetByIdReq, GetAllReq, CreateItemReq, UpdateItemReq, DeleteItemReq,
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
): void => {
  callback(null, { status: 'ok', service: 'service-a', timestamp: new Date().toISOString() });
};

export const GetById = async (
  call: UnaryCall<GetByIdReq>,
  callback: UnaryCb
): Promise<void> => {
  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);
  try {
    const item = await itemService.getById(id.trim());
    callback(null, { success: true, message: 'Item retrieved successfully', data: itemToGrpc(item) });
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
    const search = call.request.search || '';

    const { data, total } = await itemService.getAll({ page, limit, status, search });
    const totalPages = Math.ceil(total / limit);
    callback(null, {
      success: true,
      message: 'Items retrieved successfully',
      data:    data.map(itemToGrpc),
      meta:    { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const Create = async (
  call: UnaryCall<CreateItemReq>,
  callback: UnaryCb
): Promise<void> => {
  const { name, description, status } = call.request;
  if (!name?.trim()) return callback(invalidArg('name is required') as grpc.ServiceError);
  try {
    const item = await itemService.create({ name: name.trim(), description, status });
    callback(null, { success: true, message: 'Item created successfully', data: itemToGrpc(item) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const Update = async (
  call: UnaryCall<UpdateItemReq>,
  callback: UnaryCb
): Promise<void> => {
  const { id, name, description, status } = call.request;
  if (!id?.trim())   return callback(invalidArg('id is required') as grpc.ServiceError);
  if (!name?.trim()) return callback(invalidArg('name is required') as grpc.ServiceError);
  try {
    const item = await itemService.update(id.trim(), { name: name.trim(), description, status });
    callback(null, { success: true, message: 'Item updated successfully', data: itemToGrpc(item) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const Delete = async (
  call: UnaryCall<DeleteItemReq>,
  callback: UnaryCb
): Promise<void> => {
  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);
  try {
    await itemService.delete(id.trim());
    callback(null, { success: true, message: 'Item deleted successfully' });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};
