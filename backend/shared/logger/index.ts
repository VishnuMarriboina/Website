'use strict';

import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const { combine, timestamp, colorize, printf, errors: errorsFormat } = format;

const logFormat = printf(({ level, message, timestamp: ts, stack }: Record<string, unknown>) =>
  stack
    ? `${ts} [${level}]: ${message}\n${stack}`
    : `${ts} [${level}]: ${message}`
);

const logger = createLogger({
  level: process.env['LOG_LEVEL'] || (process.env['NODE_ENV'] === 'production' ? 'info' : 'debug'),
  format: combine(
    errorsFormat({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        errorsFormat({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, 'exceptions.log') }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, 'rejections.log') }),
  ],
});

export default logger;
