'use strict';

import * as grpc from '@grpc/grpc-js';
import productService from '../../services/productService';
import { productToGrpc } from '../../utils';
import { requireAdmin } from './adminHandler';
import {
  UnaryCall, UnaryCb, GrpcError,
  GetByIdReq,
  GetProductsReq, CreateProductReq, UpdateProductReq, DeleteProductReq,
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

export const GetProducts = async (
  call: UnaryCall<GetProductsReq>,
  callback: UnaryCb
): Promise<void> => {
  try {
    const page     = call.request.page     > 0 ? call.request.page     : 1;
    const limit    = call.request.limit    > 0 ? call.request.limit    : 10;
    const status   = call.request.status   || '';
    const category = call.request.category || '';
    const search   = call.request.search   || '';

    const { data, total } = await productService.getAll({ page, limit, status, category, search });
    const totalPages = Math.ceil(total / limit);
    callback(null, {
      success: true,
      message: 'Products retrieved successfully',
      data:    data.map(productToGrpc),
      meta:    { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const GetProductById = async (
  call: UnaryCall<GetByIdReq>,
  callback: UnaryCb
): Promise<void> => {
  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);
  try {
    const product = await productService.getById(id.trim());
    callback(null, { success: true, message: 'Product retrieved successfully', data: productToGrpc(product) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const CreateProduct = async (
  call: UnaryCall<CreateProductReq>,
  callback: UnaryCb
): Promise<void> => {
  if (!requireAdmin(call as unknown as UnaryCall<Record<string, unknown>>, callback)) return;

  const { name, description, category, image, price, stock, status } = call.request;
  if (!name?.trim()) return callback(invalidArg('name is required') as grpc.ServiceError);

  try {
    const product = await productService.create({
      name: name.trim(), description, category, image, price, stock, status,
    });
    callback(null, { success: true, message: 'Product created successfully', data: productToGrpc(product) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const UpdateProduct = async (
  call: UnaryCall<UpdateProductReq>,
  callback: UnaryCb
): Promise<void> => {
  if (!requireAdmin(call as unknown as UnaryCall<Record<string, unknown>>, callback)) return;

  const { id, name, description, category, image, price, stock, status } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);

  try {
    const payload: Record<string, unknown> = {};
    if (name        !== undefined) payload['name']        = name;
    if (description !== undefined) payload['description'] = description;
    if (category    !== undefined) payload['category']    = category;
    if (image       !== undefined) payload['image']       = image;
    if (price       !== undefined) payload['price']       = price;
    if (stock       !== undefined) payload['stock']       = stock;
    if (status      !== undefined) payload['status']      = status;

    const product = await productService.update(id.trim(), payload);
    callback(null, { success: true, message: 'Product updated successfully', data: productToGrpc(product) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const DeleteProduct = async (
  call: UnaryCall<DeleteProductReq>,
  callback: UnaryCb
): Promise<void> => {
  if (!requireAdmin(call as unknown as UnaryCall<Record<string, unknown>>, callback)) return;

  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);
  try {
    await productService.delete(id.trim());
    callback(null, { success: true, message: 'Product deleted successfully' });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const ActivateProduct = async (
  call: UnaryCall<GetByIdReq>,
  callback: UnaryCb
): Promise<void> => {
  if (!requireAdmin(call as unknown as UnaryCall<Record<string, unknown>>, callback)) return;

  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);
  try {
    const product = await productService.activate(id.trim());
    callback(null, { success: true, message: 'Product activated successfully', data: productToGrpc(product) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const DeactivateProduct = async (
  call: UnaryCall<GetByIdReq>,
  callback: UnaryCb
): Promise<void> => {
  if (!requireAdmin(call as unknown as UnaryCall<Record<string, unknown>>, callback)) return;

  const { id } = call.request;
  if (!id?.trim()) return callback(invalidArg('id is required') as grpc.ServiceError);
  try {
    const product = await productService.deactivate(id.trim());
    callback(null, { success: true, message: 'Product deactivated successfully', data: productToGrpc(product) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};
