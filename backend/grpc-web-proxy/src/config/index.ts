'use strict';

import { ProxyConfig } from './types';

const config: ProxyConfig = Object.freeze({
  env:  process.env['NODE_ENV'] || 'development',
  port: parseInt(process.env['PORT'] ?? '') || 8080,
  cors: {
    origin: process.env['CORS_ORIGIN'] || '*',
  },
  rateLimit: {
    windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] ?? '') || 900_000,
    max:      parseInt(process.env['RATE_LIMIT_MAX']        ?? '') || 20,
  },
  services: {
    serviceA: {
      host: process.env['SERVICE_A_GRPC_HOST'] || 'localhost',
      port: parseInt(process.env['SERVICE_A_GRPC_PORT'] ?? '') || 50051,
    },
    serviceB: {
      host: process.env['SERVICE_B_GRPC_HOST'] || 'localhost',
      port: parseInt(process.env['SERVICE_B_GRPC_PORT'] ?? '') || 50052,
    },
  },
});

export default config;
