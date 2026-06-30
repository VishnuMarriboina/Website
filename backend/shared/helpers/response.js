'use strict';

const sendSuccess = (res, data = null, message = 'Success', statusCode = 200, meta = null) => {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
};

const sendCreated = (res, data = null, message = 'Created successfully') =>
  sendSuccess(res, data, message, 201);

const sendNoContent = (res) => res.status(204).send();

const sendError = (res, message = 'An error occurred', statusCode = 500, extras = {}) =>
  res.status(statusCode).json({ success: false, message, ...extras });

const sendPaginated = (res, data, total, page, limit, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  return sendSuccess(res, data, message, 200, {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
};

module.exports = { sendSuccess, sendCreated, sendNoContent, sendError, sendPaginated };
