'use strict';

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config';
import * as refreshTokenRepo from '../repositories/refreshTokenRepository';
import { UnauthorizedError } from '../../../../shared/errors';

const REFRESH_TOKEN_BYTES = 40;

export interface AccessTokenClaims {
  id:    string;
  email: string;
  name:  string;
  role:  string;
}

export interface RotatedRefreshToken {
  refreshToken: string;
  subjectId:    string;
  subjectType:  string;
}

// Only needs to understand the small set of formats this codebase actually
// configures JWT_ACCESS_EXPIRY/JWT_REFRESH_EXPIRY with (e.g. "15m", "7d") —
// not a general-purpose duration parser.
const parseDurationMs = (duration: string): number => {
  const match = /^(\d+)(s|m|h|d)$/.exec(duration.trim());
  if (!match) return 7 * 86_400_000;
  const value  = parseInt(match[1], 10);
  const unitMs: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * unitMs[match[2]];
};

const hashToken = (raw: string): string =>
  crypto.createHash('sha256').update(raw).digest('hex');

export const signAccessToken = (claims: AccessTokenClaims): string =>
  jwt.sign(claims, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
  });

// Opaque random token — only its SHA-256 hash is persisted, so a leaked DB
// dump doesn't hand out usable refresh tokens.
export const issueRefreshToken = async (subjectId: string, subjectType: string): Promise<string> => {
  const raw       = crypto.randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
  const expiresAt = new Date(Date.now() + parseDurationMs(config.jwt.refreshExpiresIn));
  await refreshTokenRepo.create(hashToken(raw), subjectId, subjectType, expiresAt);
  return raw;
};

// Rotation: the presented token is revoked and a new one issued in the same
// call, so a stolen-and-replayed refresh token stops working the moment the
// legitimate client uses it next.
export const rotateRefreshToken = async (rawToken: string): Promise<RotatedRefreshToken> => {
  const tokenHash = hashToken(rawToken);
  const stored    = await refreshTokenRepo.findValidByHash(tokenHash);
  if (!stored) throw new UnauthorizedError('Invalid or expired refresh token');

  await refreshTokenRepo.revokeByHash(tokenHash);
  const refreshToken = await issueRefreshToken(stored.subjectId, stored.subjectType);

  return { refreshToken, subjectId: stored.subjectId, subjectType: stored.subjectType };
};

export const revokeRefreshToken = async (rawToken: string): Promise<void> => {
  await refreshTokenRepo.revokeByHash(hashToken(rawToken));
};
