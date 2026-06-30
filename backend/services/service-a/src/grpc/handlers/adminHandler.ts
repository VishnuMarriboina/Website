'use strict';

import * as grpc from '@grpc/grpc-js';
import jwt from 'jsonwebtoken';
import * as adminService from '../../services/adminService';
import config from '../../config';
import { UnaryCall, UnaryCb, GrpcError, AdminLoginReq } from './types';

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

export const verifyAdminToken = (
  call: UnaryCall<Record<string, unknown>>
): { id: string; role: string } | null => {
  const authValues = call.metadata.get('authorization');
  const raw = authValues[0] as string | undefined;
  if (!raw) return null;
  const token = raw.replace(/^Bearer\s+/i, '');
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { id: string; role: string };
    return decoded;
  } catch {
    return null;
  }
};

export const requireAdmin = (call: UnaryCall<Record<string, unknown>>, callback: UnaryCb): boolean => {
  const user = verifyAdminToken(call);
  if (!user) {
    callback({ code: grpc.status.UNAUTHENTICATED, details: 'Missing or invalid authorization token' } as grpc.ServiceError);
    return false;
  }
  if (user.role !== 'ADMIN') {
    callback({ code: grpc.status.PERMISSION_DENIED, details: 'Admin access required' } as grpc.ServiceError);
    return false;
  }
  return true;
};

export const AdminLogin = async (
  call: UnaryCall<AdminLoginReq>,
  callback: UnaryCb
): Promise<void> => {
  const { email, password } = call.request;
  if (!email?.trim())    return callback(invalidArg('email is required') as grpc.ServiceError);
  if (!password?.trim()) return callback(invalidArg('password is required') as grpc.ServiceError);

  try {
    const result = await adminService.login({
      email:    email.trim().toLowerCase(),
      password,
    });
    callback(null, {
      success: result.success,
      message: result.message,
      token:   result.token,
      admin:   result.admin,
    } as unknown as Record<string, unknown>);
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};
