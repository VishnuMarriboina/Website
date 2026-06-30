'use strict';

/** Remove undefined/null keys from an object (for partial updates) */
const cleanObject = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null));

/** Async sleep */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Check if a string is a valid Mongo ObjectId */
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

/** Paginate an in-memory array */
const paginateArray = (arr, page, limit) => {
  const start = (page - 1) * limit;
  return arr.slice(start, start + limit);
};

/** Parse boolean from env string */
const parseBool = (val, fallback = false) => {
  if (val === undefined || val === null) return fallback;
  return val === true || val === 'true' || val === '1';
};

module.exports = { cleanObject, sleep, isValidObjectId, paginateArray, parseBool };
