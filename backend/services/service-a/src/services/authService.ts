'use strict';

import bcrypt from 'bcryptjs';
import * as userRepo from '../repositories/userRepository';
import * as adminRepo from '../repositories/adminRepository';
import * as tokenService from './tokenService';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../../../shared/errors';
import { IUser, IAdmin } from '../models/types';
import { RegisterParams, LoginParams, AuthResult, UserDto, LogoutResult } from './types';

const SALT_ROUNDS = 10;

const userToResponse = (user: IUser): UserDto => ({
  id:        user.id ?? '',
  name:      user.name,
  email:     user.email,
  role:      'USER',
  createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : '',
});

const toUserAuthResult = (user: IUser, message: string, refreshToken: string): AuthResult => ({
  success:      true,
  message,
  token:        tokenService.signAccessToken({ id: user.id, email: user.email, name: user.name, role: 'USER' }),
  refreshToken,
  user:         userToResponse(user),
});

const toAdminAuthResult = (admin: IAdmin, message: string, refreshToken: string): AuthResult => ({
  success:      true,
  message,
  token:        tokenService.signAccessToken({ id: admin.id, email: admin.email, name: admin.name, role: 'ADMIN' }),
  refreshToken,
  user: {
    id:        admin.id ?? '',
    name:      admin.name,
    email:     admin.email,
    role:      'ADMIN',
    createdAt: admin.createdAt ? new Date(admin.createdAt).toISOString() : '',
  },
});

export const register = async ({ name, email, password }: RegisterParams): Promise<AuthResult> => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new ConflictError(`Email ${email} is already registered`);

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user         = await userRepo.create({ name, email, passwordHash }) as unknown as IUser;
  const refreshToken = await tokenService.issueRefreshToken(user.id, 'USER');

  return toUserAuthResult(user, 'Registration successful! Welcome to ServCrust.', refreshToken);
};

export const login = async ({ email, password }: LoginParams): Promise<AuthResult> => {
  // Check users first, then fall through to admins
  const user = await userRepo.findByEmail(email);

  if (user) {
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Incorrect password');
    const refreshToken = await tokenService.issueRefreshToken(user.id, 'USER');
    return toUserAuthResult(user as unknown as IUser, `Welcome back, ${user.name}!`, refreshToken);
  }

  // Not a regular user — check admin collection
  const admin = await adminRepo.findByEmail(email);
  if (!admin) throw new NotFoundError('No account found with this email address');

  const a = admin as unknown as IAdmin;
  const valid = await bcrypt.compare(password, a.passwordHash);
  if (!valid) throw new UnauthorizedError('Incorrect password');

  const refreshToken = await tokenService.issueRefreshToken(a.id, 'ADMIN');
  return toAdminAuthResult(a, `Welcome back, ${a.name}!`, refreshToken);
};

export const refreshToken = async (rawRefreshToken: string): Promise<AuthResult> => {
  const rotated = await tokenService.rotateRefreshToken(rawRefreshToken);

  if (rotated.subjectType === 'ADMIN') {
    const admin = await adminRepo.findById(rotated.subjectId);
    if (!admin) throw new UnauthorizedError('Account no longer exists');
    return toAdminAuthResult(admin as unknown as IAdmin, 'Token refreshed', rotated.refreshToken);
  }

  const user = await userRepo.findById(rotated.subjectId);
  if (!user) throw new UnauthorizedError('Account no longer exists');
  return toUserAuthResult(user as unknown as IUser, 'Token refreshed', rotated.refreshToken);
};

export const logout = async (rawRefreshToken: string): Promise<LogoutResult> => {
  await tokenService.revokeRefreshToken(rawRefreshToken);
  return { success: true, message: 'Logged out' };
};
