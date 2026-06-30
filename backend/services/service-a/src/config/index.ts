'use strict';

import { ServiceAConfig } from './types';

const config: ServiceAConfig = Object.freeze({
  env: process.env['NODE_ENV'] || 'development',
  grpc: {
    port: parseInt(process.env['SERVICE_A_GRPC_PORT'] ?? '') || 50051,
    host: '0.0.0.0',
  },
  db: {
    uri: process.env['MONGODB_URI'] || 'mongodb://localhost:27017/myData',
  },
  jwt: {
    secret:    process.env['JWT_SECRET']     || 'change_this_secret_in_production',
    expiresIn: process.env['JWT_EXPIRES_IN'] || '7d',
  },
  services: {
    serviceB: {
      host: process.env['SERVICE_B_GRPC_HOST'] || 'localhost',
      port: parseInt(process.env['SERVICE_B_GRPC_PORT'] ?? '') || 50052,
    },
  },
});

export default config;
