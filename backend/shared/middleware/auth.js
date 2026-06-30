'use strict';

const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../errors');

/**
 * JWT authentication middleware template.
 * Attach decoded payload to req.user.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or malformed Authorization header'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Access token expired'));
    }
    return next(new UnauthorizedError('Invalid access token'));
  }
};

/**
 * Role-based authorization factory.
 * Usage: authorize('admin', 'superadmin')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return next(new UnauthorizedError('Not authenticated'));
  if (!roles.includes(req.user.role)) {
    return next(new ForbiddenError('Insufficient permissions'));
  }
  return next();
};

module.exports = { authenticate, authorize };
