'use strict';

import * as grpc from '@grpc/grpc-js';
import jwt from 'jsonwebtoken';
import cartService from '../../services/cartService';
import { cartToGrpc, orderToGrpc } from '../../utils';
import config from '../../config';
import {
  UnaryCall, UnaryCb, GrpcError,
  AddToCartReq, UpdateCartItemReq, RemoveFromCartReq,
} from './types';

const mapError = (err: { statusCode?: number; message: string }): GrpcError => {
  const statusMap: Record<number, number> = {
    400: grpc.status.INVALID_ARGUMENT,
    401: grpc.status.UNAUTHENTICATED,
    403: grpc.status.PERMISSION_DENIED,
    404: grpc.status.NOT_FOUND,
    409: grpc.status.ALREADY_EXISTS,
  };
  return {
    code:    (err.statusCode ? statusMap[err.statusCode] : undefined) ?? grpc.status.INTERNAL,
    details: err.message,
  };
};

const extractUserId = (call: UnaryCall<Record<string, unknown>>): string | null => {
  const raw = (call.metadata.get('authorization')[0] as string | undefined);
  if (!raw) return null;
  const token = raw.replace(/^Bearer\s+/i, '');
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
};

const unauthenticated = (): grpc.ServiceError =>
  ({ code: grpc.status.UNAUTHENTICATED, details: 'Please login to manage your cart.' } as grpc.ServiceError);

export const AddToCart = async (
  call: UnaryCall<AddToCartReq>,
  callback: UnaryCb
): Promise<void> => {
  const userId = extractUserId(call as unknown as UnaryCall<Record<string, unknown>>);
  if (!userId) return callback(unauthenticated());

  const { productId, quantity } = call.request;
  if (!productId?.trim()) return callback({ code: grpc.status.INVALID_ARGUMENT, details: 'productId is required' } as grpc.ServiceError);
  if (!quantity || quantity < 1) return callback({ code: grpc.status.INVALID_ARGUMENT, details: 'quantity must be at least 1' } as grpc.ServiceError);

  try {
    const cart = await cartService.addToCart({ userId, productId: productId.trim(), quantity });
    callback(null, { success: true, message: 'Item added to cart', data: cartToGrpc(cart) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const GetCart = async (
  call: UnaryCall<Record<string, unknown>>,
  callback: UnaryCb
): Promise<void> => {
  const userId = extractUserId(call);
  if (!userId) return callback(unauthenticated());

  try {
    const cart = await cartService.getCart(userId);
    callback(null, { success: true, message: 'Cart retrieved', data: cartToGrpc(cart) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const UpdateCartItem = async (
  call: UnaryCall<UpdateCartItemReq>,
  callback: UnaryCb
): Promise<void> => {
  const userId = extractUserId(call as unknown as UnaryCall<Record<string, unknown>>);
  if (!userId) return callback(unauthenticated());

  const { productId, quantity } = call.request;
  if (!productId?.trim()) return callback({ code: grpc.status.INVALID_ARGUMENT, details: 'productId is required' } as grpc.ServiceError);

  try {
    const cart = await cartService.updateCartItem({ userId, productId: productId.trim(), quantity });
    callback(null, { success: true, message: 'Cart updated', data: cartToGrpc(cart) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const RemoveFromCart = async (
  call: UnaryCall<RemoveFromCartReq>,
  callback: UnaryCb
): Promise<void> => {
  const userId = extractUserId(call as unknown as UnaryCall<Record<string, unknown>>);
  if (!userId) return callback(unauthenticated());

  const { productId } = call.request;
  if (!productId?.trim()) return callback({ code: grpc.status.INVALID_ARGUMENT, details: 'productId is required' } as grpc.ServiceError);

  try {
    const cart = await cartService.removeFromCart(userId, productId.trim());
    callback(null, { success: true, message: 'Item removed from cart', data: cartToGrpc(cart) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const ClearCart = async (
  call: UnaryCall<Record<string, unknown>>,
  callback: UnaryCb
): Promise<void> => {
  const userId = extractUserId(call);
  if (!userId) return callback(unauthenticated());

  try {
    await cartService.clearCart(userId);
    callback(null, { success: true, message: 'Cart cleared' });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const CheckoutCart = async (
  call: UnaryCall<Record<string, unknown>>,
  callback: UnaryCb
): Promise<void> => {
  const userId = extractUserId(call);
  if (!userId) return callback(unauthenticated());

  try {
    const order = await cartService.checkoutCart(userId);
    callback(null, { success: true, message: 'Order placed successfully', data: orderToGrpc(order) });
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};
