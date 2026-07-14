
'use strict';

import * as grpc from '@grpc/grpc-js';
import * as userRepository from '../../repositories/userRepository';
import { requireAdmin } from './adminHandler';
import { UnaryCall, UnaryCb, GetUsersReq } from './types';

const mapError = (err: { statusCode?: number; message: string }) => ({
  code:    grpc.status.INTERNAL,
  details: err.message,
});

export const GetAllUsers = async (
  call: UnaryCall<GetUsersReq>,
  callback: UnaryCb
): Promise<void> => {
  if (!requireAdmin(call as unknown as UnaryCall<Record<string, unknown>>, callback)) return;

  try {
    const page  = call.request.page  > 0 ? call.request.page  : 1;
    const limit = call.request.limit > 0 ? call.request.limit : 10;

    const [users, total] = await Promise.all([
      userRepository.getAll(page, limit),
      userRepository.countAll(),
    ]);

    const totalPages = Math.ceil(total / limit);

    callback(null, {
      success: true,
      message: 'Users retrieved successfully',
      data: users.map((u) => ({
        id:        u.id ?? '',
        name:      u.name,
        email:     u.email,
        role:      'USER',
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : '',
      })),
      meta: { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (err) {
    callback(mapError(err as { message: string }) as grpc.ServiceError);
  }
};
