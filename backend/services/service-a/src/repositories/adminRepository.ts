'use strict';

import Admin from '../models/adminModel';
import { IAdmin } from '../models/types';

export const findByEmail = (email: string) =>
  Admin.findOne({ email: email.toLowerCase() });

export const findById = (id: string) =>
  Admin.findById(id).lean() as Promise<IAdmin | null>;

export const create = ({ name, email, passwordHash }: Pick<IAdmin, 'name' | 'email' | 'passwordHash'>) =>
  Admin.create({ name, email: email.toLowerCase(), passwordHash, role: 'ADMIN' });

export const existsByEmail = async (email: string, excludeId?: string): Promise<boolean> => {
  const filter: Record<string, unknown> = { email: email.toLowerCase() };
  if (excludeId) filter['_id'] = { $ne: excludeId };
  return !!(await Admin.exists(filter));
};
