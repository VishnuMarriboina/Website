'use strict';

import * as grpc from '@grpc/grpc-js';
import * as authService from '../../services/authService';
import { UnaryCall, UnaryCb, GrpcError, RegisterReq, LoginReq, RefreshTokenReq, LogoutReq } from './types';

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

export const Register = async (
  call: UnaryCall<RegisterReq>,
  callback: UnaryCb
): Promise<void> => {
  const { name, email, password } = call.request;
  if (!name?.trim())     return callback(invalidArg('name is required') as grpc.ServiceError);
  if (!email?.trim())    return callback(invalidArg('email is required') as grpc.ServiceError);
  if (!password?.trim()) return callback(invalidArg('password is required') as grpc.ServiceError);
  if (password.length < 6) return callback(invalidArg('password must be at least 6 characters') as grpc.ServiceError);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return callback(invalidArg('invalid email address') as grpc.ServiceError);

  try {
    const result = await authService.register({
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      password,
    });
    callback(null, result as unknown as Record<string, unknown>);
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const Login = async (
  call: UnaryCall<LoginReq>,
  callback: UnaryCb
): Promise<void> => {
  const { email, password } = call.request;
  if (!email?.trim())    return callback(invalidArg('email is required') as grpc.ServiceError);
  if (!password?.trim()) return callback(invalidArg('password is required') as grpc.ServiceError);

  try {
    const result = await authService.login({
      email:    email.trim().toLowerCase(),
      password,
    });
    callback(null, result as unknown as Record<string, unknown>);
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const RefreshToken = async (
  call: UnaryCall<RefreshTokenReq>,
  callback: UnaryCb
): Promise<void> => {
  const { refreshToken } = call.request;
  if (!refreshToken?.trim()) return callback(invalidArg('refreshToken is required') as grpc.ServiceError);

  try {
    const result = await authService.refreshToken(refreshToken);
    callback(null, result as unknown as Record<string, unknown>);
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};

export const Logout = async (
  call: UnaryCall<LogoutReq>,
  callback: UnaryCb
): Promise<void> => {
  const { refreshToken } = call.request;
  if (!refreshToken?.trim()) return callback(invalidArg('refreshToken is required') as grpc.ServiceError);

  try {
    const result = await authService.logout(refreshToken);
    callback(null, result as unknown as Record<string, unknown>);
  } catch (err) {
    callback(mapError(err as { statusCode?: number; message: string }) as grpc.ServiceError);
  }
};
