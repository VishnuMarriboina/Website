'use strict';

import * as grpc from '@grpc/grpc-js';
import jwt from 'jsonwebtoken';
import orderService from '../../services/orderService';
import { orderToGrpc } from '../../utils';
import config from '../../config';
import { requireAdmin } from './adminHandler';
import {
  UnaryCall, UnaryCb, GrpcError,
  GetByIdReq, CreateOrderReq, GetOrdersReq, GetUserOrdersReq, UpdateOrderStatusReq,
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

const extractUserId = (call: UnaryCall<Record<string, unknown>>): string | null => {
  const authValues = call.metadata.get('authorization');
  const raw = authValues[0] as string | undefined;
  if (!raw) return null;
  const token = raw.replace(/^Bearer\s+/i, '');
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
};

export const CreateOrder = async (
  call: UnaryCall<CreateOrderReq>,
  callback: UnaryCb
): Promise<void> => {
  const userId = extractUserId(call as unknown as UnaryCall<Record<string, unknown>>);
  if (!userId) {
    return callback({
      code:    grpc.status.UNAUTHENTICATED,
      details: 'Please login to purchase products.',
    } as grpc.ServiceError);
  }

  const { productId, quantity } = call.request;
  if (!productId?.trim()) return callback(invalidArg('productId is required') as grpc.ServiceError);
  if (!quantity || quantity < 1) return callback(invalidArg('quantity must be at least 1') as grpc.ServiceError);

  try {
    const order = await orderService.create({ userId, productId: productId.trim(), quantity });
    callback(null, { success: true, message: 'Order placed successfully', data: orderToGrpc(order) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const GetOrderById = async (
  call: UnaryCall<GetByIdReq>,
  callback: UnaryCb
): Promise<void> => {
  if (!requireAdmin(call as unknown as UnaryCall<Record<string, unknown>>, callback)) return;

  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);
  try {
    const order = await orderService.getById(id.trim());
    callback(null, { success: true, message: 'Order retrieved successfully', data: orderToGrpc(order) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const GetOrders = async (
  call: UnaryCall<GetOrdersReq>,
  callback: UnaryCb
): Promise<void> => {
  if (!requireAdmin(call as unknown as UnaryCall<Record<string, unknown>>, callback)) return;

  try {
    const page        = call.request.page        > 0 ? call.request.page        : 1;
    const limit       = call.request.limit       > 0 ? call.request.limit       : 10;
    const orderStatus = call.request.orderStatus || '';

    const { data, total } = await orderService.getAll({ page, limit, orderStatus });
    const totalPages = Math.ceil(total / limit);
    callback(null, {
      success: true,
      message: 'Orders retrieved successfully',
      data:    data.map(orderToGrpc),
      meta:    { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const UpdateOrderStatus = async (
  call: UnaryCall<UpdateOrderStatusReq>,
  callback: UnaryCb
): Promise<void> => {
  if (!requireAdmin(call as unknown as UnaryCall<Record<string, unknown>>, callback)) return;

  const { id, orderStatus } = call.request;
  if (!id?.trim())          return callback(invalidArg('id is required') as grpc.ServiceError);
  if (!orderStatus?.trim()) return callback(invalidArg('orderStatus is required') as grpc.ServiceError);

  try {
    const order = await orderService.updateStatus(id.trim(), orderStatus.trim());
    callback(null, { success: true, message: 'Order status updated', data: orderToGrpc(order) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const GetUserOrders = async (
  call: UnaryCall<GetUserOrdersReq>,
  callback: UnaryCb
): Promise<void> => {
  const requestedUserId = call.request.userId;

  const authValues = call.metadata.get('authorization');
  const raw = authValues[0] as string | undefined;
  if (!raw) {
    return callback({
      code:    grpc.status.UNAUTHENTICATED,
      details: 'Please login to view your orders.',
    } as grpc.ServiceError);
  }

  const token = raw.replace(/^Bearer\s+/i, '');
  let tokenUserId = '';
  let tokenRole   = '';
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { id: string; role: string };
    tokenUserId = decoded.id;
    tokenRole   = decoded.role;
  } catch {
    return callback({ code: grpc.status.UNAUTHENTICATED, details: 'Invalid authorization token' } as grpc.ServiceError);
  }

  const userId = tokenRole === 'ADMIN' ? (requestedUserId || tokenUserId) : tokenUserId;

  if (!userId?.trim()) return callback(invalidArg('userId is required') as grpc.ServiceError);

  try {
    const page  = call.request.page  > 0 ? call.request.page  : 1;
    const limit = call.request.limit > 0 ? call.request.limit : 10;

    const { data, total } = await orderService.getUserOrders(userId.trim(), page, limit);
    const totalPages = Math.ceil(total / limit);
    callback(null, {
      success: true,
      message: 'User orders retrieved successfully',
      data:    data.map(orderToGrpc),
      meta:    { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};
