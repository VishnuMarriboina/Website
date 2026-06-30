'use strict';

import { ValidationDetail } from './types';

export class AppError extends Error {
  statusCode: number;
  errorCode:  string;
  isOperational: boolean;

  constructor(message: string, statusCode: number, errorCode?: string) {
    super(message);
    this.name          = this.constructor.name;
    this.statusCode    = statusCode;
    this.errorCode     = errorCode ?? `ERR_${statusCode}`;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400, 'ERR_BAD_REQUEST');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'ERR_UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'ERR_FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'ERR_NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409, 'ERR_CONFLICT');
  }
}

export class ValidationError extends AppError {
  errors: ValidationDetail[];

  constructor(message = 'Validation failed', errors: ValidationDetail[] = []) {
    super(message, 422, 'ERR_VALIDATION');
    this.errors = errors;
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500, 'ERR_INTERNAL');
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable') {
    super(message, 503, 'ERR_SERVICE_UNAVAILABLE');
  }
}
