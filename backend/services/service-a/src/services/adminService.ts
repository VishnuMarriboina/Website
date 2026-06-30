'use strict';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import * as adminRepo from '../repositories/adminRepository';
import { NotFoundError, UnauthorizedError } from '../../../../shared/errors';
import { IAdmin } from '../models/types';
import { AdminLoginParams, AdminAuthResult, AdminDto } from './types';

const SALT_ROUNDS = 10;

const generateAdminToken = (admin: IAdmin): string =>
  jwt.sign(
    { id: admin._id?.toString(), email: admin.email, name: admin.name, role: 'ADMIN' },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] }
  );

const adminToDto = (admin: IAdmin): AdminDto => ({
  id:        admin._id?.toString() ?? '',
  name:      admin.name,
  email:     admin.email,
  role:      admin.role,
  createdAt: admin.createdAt ? new Date(admin.createdAt).toISOString() : '',
});

export const login = async ({ email, password }: AdminLoginParams): Promise<AdminAuthResult> => {
  const admin = await adminRepo.findByEmail(email);
  if (!admin) throw new NotFoundError('No admin account found with this email address');

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) throw new UnauthorizedError('Incorrect password');

  return {
    success: true,
    message: `Welcome back, ${admin.name}!`,
    token:   generateAdminToken(admin as unknown as IAdmin),
    admin:   adminToDto(admin as unknown as IAdmin),
  };
};

export const createAdmin = async (name: string, email: string, password: string): Promise<IAdmin> => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const admin = await adminRepo.create({ name, email, passwordHash });
  return admin as unknown as IAdmin;
};
