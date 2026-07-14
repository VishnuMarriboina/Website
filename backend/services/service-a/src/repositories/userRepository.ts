'use strict';

import prisma from '../config/prisma';
import { IUser } from '../models/types';

export const findByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email: email.toLowerCase() } });

export const findById = (id: string): Promise<IUser | null> =>
  prisma.user.findUnique({ where: { id } }) as Promise<IUser | null>;

export const create = ({ name, email, passwordHash }: Pick<IUser, 'name' | 'email' | 'passwordHash'>) =>
  prisma.user.create({ data: { name, email: email.toLowerCase(), passwordHash } });

export const getAll = async (page = 1, limit = 10): Promise<IUser[]> => {
  const skip = (page - 1) * limit;
  return prisma.user.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }) as Promise<IUser[]>;
};

export const countAll = (): Promise<number> =>
  prisma.user.count();
