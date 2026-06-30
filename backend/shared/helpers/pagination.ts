'use strict';

import { PAGINATION } from '../constants';
import { PaginationQuery, ParsedPagination, PaginationMeta } from './types';

export const parsePagination = (query: PaginationQuery = {}): ParsedPagination => {
  const page  = Math.max(1, parseInt(String(query.page))  || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(String(query.limit)) || PAGINATION.DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const buildMeta = (total: number, page: number, limit: number): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
};
