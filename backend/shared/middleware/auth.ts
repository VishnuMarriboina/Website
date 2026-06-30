'use strict';

import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../errors';
import { AuthenticatedRequest, JwtPayload, MinimalResponse, NextFn } from './types';

export const authenticate = (
  req: AuthenticatedRequest,
  _res: MinimalResponse,
  next: NextFn
): void => {
  const authHeader = req.headers['authorization'] as string | undefined;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or malformed Authorization header'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] as string) as JwtPayload;
    req.user = decoded;
    return next();
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Access token expired'));
    }
    return next(new UnauthorizedError('Invalid access token'));
  }
};

export const authorize = (...roles: string[]) =>
  (req: AuthenticatedRequest, _res: MinimalResponse, next: NextFn): void => {
    if (!req.user) return next(new UnauthorizedError('Not authenticated'));
    if (!roles.includes(req.user.role ?? '')) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    return next();
  };
