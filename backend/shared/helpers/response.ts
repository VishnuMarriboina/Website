'use strict';

import { MinimalResponse, PaginationMeta } from './types';

export const sendSuccess = (
  res: MinimalResponse,
  data: unknown = null,
  message = 'Success',
  statusCode = 200,
  meta: PaginationMeta | null = null
): MinimalResponse => {
  const body: Record<string, unknown> = { success: true, message, data };
  if (meta) body['meta'] = meta;
  return res.status(statusCode).json(body);
};

export const sendCreated = (
  res: MinimalResponse,
  data: unknown = null,
  message = 'Created successfully'
): MinimalResponse => sendSuccess(res, data, message, 201);

export const sendNoContent = (res: MinimalResponse): void => res.send();

export const sendError = (
  res: MinimalResponse,
  message = 'An error occurred',
  statusCode = 500,
  extras: Record<string, unknown> = {}
): MinimalResponse =>
  res.status(statusCode).json({ success: false, message, ...extras });

export const sendPaginated = (
  res: MinimalResponse,
  data: unknown,
  total: number,
  page: number,
  limit: number,
  message = 'Success'
): MinimalResponse => {
  const totalPages = Math.ceil(total / limit);
  return sendSuccess(res, data, message, 200, {
    total, page, limit, totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
};
