'use strict';

const Joi = require('joi');
const { ValidationError } = require('../errors');

/**
 * Validate req.body / req.query / req.params against a Joi schema.
 * Returns an Express middleware.
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });

  if (error) {
    const errors = error.details.map((d) => ({
      field:   d.context.key,
      message: d.message.replace(/['"]/g, ''),
    }));
    return next(new ValidationError('Validation failed', errors));
  }

  req[source] = value;
  return next();
};

/** Reusable Joi schemas */
const commonSchemas = {
  id: Joi.string().length(24).hex().required().messages({
    'string.length': 'ID must be a valid 24-character hex string',
    'string.hex':    'ID must be a valid hex string',
  }),

  pagination: Joi.object({
    page:   Joi.number().integer().min(1).default(1),
    limit:  Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().trim().optional(),
    status: Joi.string().trim().optional(),
  }),
};

module.exports = { validate, commonSchemas, Joi };
