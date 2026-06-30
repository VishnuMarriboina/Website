'use strict';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import * as userRepo from '../repositories/userRepository';
import * as adminRepo from '../repositories/adminRepository';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../../../shared/errors';
import { IUser, IAdmin } from '../models/types';
import { RegisterParams, LoginParams, AuthResult, UserDto } from './types';

const SALT_ROUNDS = 10;

const generateToken = (user: IUser): string =>
  jwt.sign(
    { id: user._id?.toString(), email: user.email, name: user.name, role: 'USER' },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] }
  );

const userToResponse = (user: IUser): UserDto => ({
  id:        user._id?.toString() ?? '',
  name:      user.name,
  email:     user.email,
  role:      'USER',
  createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : '',
});

export const register = async ({ name, email, password }: RegisterParams): Promise<AuthResult> => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new ConflictError(`Email ${email} is already registered`);

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user         = await userRepo.create({ name, email, passwordHash });

  return {
    success: true,
    message: 'Registration successful! Welcome to ServCrust.',
    token:   generateToken(user as unknown as IUser),
    user:    userToResponse(user as unknown as IUser),
  };
};

export const login = async ({ email, password }: LoginParams): Promise<AuthResult> => {
  // Check users first, then fall through to admins
  const user = await userRepo.findByEmail(email);

  if (user) {
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Incorrect password');
    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      token:   generateToken(user as unknown as IUser),
      user:    userToResponse(user as unknown as IUser),
    };
  }

  // Not a regular user — check admin collection
  const admin = await adminRepo.findByEmail(email);
  if (!admin) throw new NotFoundError('No account found with this email address');

  const valid = await bcrypt.compare(password, (admin as unknown as IAdmin).passwordHash);
  if (!valid) throw new UnauthorizedError('Incorrect password');

  const a = admin as unknown as IAdmin;
  return {
    success: true,
    message: `Welcome back, ${a.name}!`,
    token: jwt.sign(
      { id: a._id?.toString(), email: a.email, name: a.name, role: 'ADMIN' },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] }
    ),
    user: {
      id:        a._id?.toString() ?? '',
      name:      a.name,
      email:     a.email,
      role:      'ADMIN',
      createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : '',
    },
  };
};
