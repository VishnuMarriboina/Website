'use strict';

import logger from '../logger';
import { AppError, ValidationError } from '../errors';
import { MinimalRequest, MinimalResponse, NextFn } from './types';

interface MongooseValidationError extends Error {
  errors: Record<string, { path: string; message: string }>;
}

interface MongooseDuplicateError extends Error {
  code: number;
  keyValue?: Record<string, unknown>;
}

const errorHandler = (
  err: unknown,
  _req: MinimalRequest,
  res: MinimalResponse,
  _next: NextFn
): MinimalResponse => {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) logger.error(`[${err.errorCode}] ${err.message}`, { stack: err.stack });

    const body: Record<string, unknown> = {
      success:   false,
      message:   err.message,
      errorCode: err.errorCode,
    };
    if (err instanceof ValidationError && err.errors?.length) {
      body['errors'] = err.errors;
    }
    return res.status(err.statusCode).json(body);
  }

  if (err instanceof Error && err.name === 'ValidationError') {
    const mongoErr = err as MongooseValidationError;
    const errors = Object.values(mongoErr.errors).map((e) => ({ field: e.path, message: e.message }));
    return res.status(422).json({ success: false, message: 'Validation failed', errorCode: 'ERR_VALIDATION', errors });
  }

  const dupErr = err as MongooseDuplicateError;
  if (dupErr.code === 11000) {
    const field = Object.keys(dupErr.keyValue || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `Duplicate value for '${field}'`, errorCode: 'ERR_CONFLICT' });
  }

  if (err instanceof Error && err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token', errorCode: 'ERR_UNAUTHORIZED' });
  }

  const errMessage = err instanceof Error ? err.message : 'Unknown error';
  const errStack   = err instanceof Error ? err.stack  : undefined;
  logger.error('Unhandled error:', { message: errMessage, stack: errStack });
  return res.status(500).json({
    success:   false,
    message:   process.env['NODE_ENV'] === 'production' ? 'Internal server error' : errMessage,
    errorCode: 'ERR_INTERNAL',
  });
};

export default errorHandler;
