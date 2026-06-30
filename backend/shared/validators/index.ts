'use strict';

import Joi from 'joi';
import { ValidationError } from '../errors';
import { ValidationSource, ValidationErrorDetail } from './types';

interface RequestLike {
  body?:   unknown;
  query?:  unknown;
  params?: unknown;
  [key: string]: unknown;
}

export const validate = (schema: Joi.Schema, source: ValidationSource = 'body') =>
  (req: RequestLike, _res: unknown, next: (err?: unknown) => void): void => {
    const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });

    if (error) {
      const errors: ValidationErrorDetail[] = error.details.map((d) => ({
        field:   d.context?.key,
        message: d.message.replace(/['"]/g, ''),
      }));
      return next(new ValidationError('Validation failed', errors));
    }

    req[source] = value;
    return next();
  };

export const commonSchemas = {
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

export { Joi };
