'use strict';

import prisma from '../config/prisma';
import { IAdmin } from '../models/types';

export const findByEmail = (email: string) =>
  prisma.admin.findUnique({ where: { email: email.toLowerCase() } });

export const findById = (id: string): Promise<IAdmin | null> =>
  prisma.admin.findUnique({ where: { id } }) as Promise<IAdmin | null>;

export const create = ({ name, email, passwordHash }: Pick<IAdmin, 'name' | 'email' | 'passwordHash'>) =>
  prisma.admin.create({ data: { name, email: email.toLowerCase(), passwordHash, role: 'ADMIN' } });

export const existsByEmail = async (email: string, excludeId?: string): Promise<boolean> => {
  const admin = await prisma.admin.findFirst({
    where: {
      email: email.toLowerCase(),
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: { id: true },
  });
  return !!admin;
};
