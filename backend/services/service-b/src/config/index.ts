'use strict';

import { ServiceBConfig } from './types';

const config: ServiceBConfig = Object.freeze({
  env: process.env['NODE_ENV'] || 'development',
  grpc: {
    port: parseInt(process.env['SERVICE_B_GRPC_PORT'] ?? '') || 50052,
    host: '0.0.0.0',
  },
  db: {
    url: process.env['DATABASE_URL'] || 'mysql://root:@localhost:3306/servcrust',
  },
  jwt: {
    secret: process.env['JWT_SECRET'] || 'change_this_secret_in_production',
  },
  services: {
    serviceA: {
      host: process.env['SERVICE_A_GRPC_HOST'] || 'localhost',
      port: parseInt(process.env['SERVICE_A_GRPC_PORT'] ?? '') || 50051,
    },
  },
});

export default config;
