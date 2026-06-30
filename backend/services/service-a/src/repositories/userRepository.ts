'use strict';

import User from '../models/userModel';
import { IUser } from '../models/types';

export const findByEmail = (email: string) =>
  User.findOne({ email: email.toLowerCase() });

export const create = ({ name, email, passwordHash }: Pick<IUser, 'name' | 'email' | 'passwordHash'>) =>
  User.create({ name, email: email.toLowerCase(), passwordHash });

export const getAll = (page = 1, limit = 10): Promise<IUser[]> => {
  const skip = (page - 1) * limit;
  return User.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean() as Promise<IUser[]>;
};

export const countAll = (): Promise<number> =>
  User.countDocuments({});
