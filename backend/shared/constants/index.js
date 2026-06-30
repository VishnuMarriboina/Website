'use strict';

const HTTP_STATUS = Object.freeze({
  OK:                  200,
  CREATED:             201,
  ACCEPTED:            202,
  NO_CONTENT:          204,
  BAD_REQUEST:         400,
  UNAUTHORIZED:        401,
  FORBIDDEN:           403,
  NOT_FOUND:           404,
  METHOD_NOT_ALLOWED:  405,
  CONFLICT:            409,
  UNPROCESSABLE:       422,
  TOO_MANY_REQUESTS:   429,
  INTERNAL_SERVER:     500,
  NOT_IMPLEMENTED:     501,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT:     504,
});

const GRPC_STATUS = Object.freeze({
  OK:                0,
  CANCELLED:         1,
  UNKNOWN:           2,
  INVALID_ARGUMENT:  3,
  DEADLINE_EXCEEDED: 4,
  NOT_FOUND:         5,
  ALREADY_EXISTS:    6,
  PERMISSION_DENIED: 7,
  INTERNAL:          13,
  UNAVAILABLE:       14,
  UNAUTHENTICATED:   16,
});

const ENVIRONMENTS = Object.freeze({
  DEVELOPMENT: 'development',
  PRODUCTION:  'production',
  TEST:        'test',
  STAGING:     'staging',
});

const PAGINATION = Object.freeze({
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT:     100,
});

const TOKEN = Object.freeze({
  ACCESS_EXPIRY:  '15m',
  REFRESH_EXPIRY: '7d',
});

const CACHE = Object.freeze({
  SHORT_TTL:   300,    // 5 min
  DEFAULT_TTL: 3600,   // 1 hr
  LONG_TTL:    86400,  // 24 hr
});

const ITEM_STATUS = Object.freeze({
  ACTIVE:   'active',
  INACTIVE: 'inactive',
  DRAFT:    'draft',
  ARCHIVED: 'archived',
});

module.exports = {
  HTTP_STATUS,
  GRPC_STATUS,
  ENVIRONMENTS,
  PAGINATION,
  TOKEN,
  CACHE,
  ITEM_STATUS,
};
