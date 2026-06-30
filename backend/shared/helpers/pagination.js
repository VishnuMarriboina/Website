'use strict';

const { PAGINATION } = require('../constants');

const parsePagination = (query = {}) => {
  const page  = Math.max(1, parseInt(query.page)  || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const buildMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
};

module.exports = { parsePagination, buildMeta };
