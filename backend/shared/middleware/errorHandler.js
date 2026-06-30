'use strict';

const logger = require('../logger');
const { AppError, ValidationError } = require('../errors');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Known operational error
  if (err instanceof AppError) {
    if (err.statusCode >= 500) logger.error(`[${err.errorCode}] ${err.message}`, { stack: err.stack });

    const body = {
      success:   false,
      message:   err.message,
      errorCode: err.errorCode,
    };
    if (err instanceof ValidationError && err.errors?.length) {
      body.errors = err.errors;
    }
    return res.status(err.statusCode).json(body);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return res.status(422).json({ success: false, message: 'Validation failed', errorCode: 'ERR_VALIDATION', errors });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `Duplicate value for '${field}'`, errorCode: 'ERR_CONFLICT' });
  }

  // JWT errors (caught generically in case not wrapped)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token', errorCode: 'ERR_UNAUTHORIZED' });
  }

  // Unknown / programmer error
  logger.error('Unhandled error:', { message: err.message, stack: err.stack });
  return res.status(500).json({
    success:   false,
    message:   process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    errorCode: 'ERR_INTERNAL',
  });
};

module.exports = errorHandler;
