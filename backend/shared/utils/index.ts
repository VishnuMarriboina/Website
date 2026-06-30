'use strict';

import { PlainObject } from './types';

export const cleanObject = (obj: PlainObject): PlainObject =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null));

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isValidObjectId = (id: string): boolean =>
  /^[a-f\d]{24}$/i.test(id);

export const paginateArray = <T>(arr: T[], page: number, limit: number): T[] => {
  const start = (page - 1) * limit;
  return arr.slice(start, start + limit);
};

export const parseBool = (val: unknown, fallback = false): boolean => {
  if (val === undefined || val === null) return fallback;
  return val === true || val === 'true' || val === '1';
};
