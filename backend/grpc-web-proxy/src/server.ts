'use strict';

import 'dotenv/config';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

import app    from './app';
import config from './config';

const server = app.listen(config.port, () => {
  console.log(`[grpc-web-proxy] listening on port ${config.port} (${config.env})`);
  console.log(`[grpc-web-proxy] → Service A gRPC at ${config.services.serviceA.host}:${config.services.serviceA.port}`);
  console.log(`[grpc-web-proxy] → Service B gRPC at ${config.services.serviceB.host}:${config.services.serviceB.port}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  console.error('[grpc-web-proxy] Server error:', err.message);
  process.exit(1);
});

const _keepAlive = setInterval(() => {}, 1 << 30);

const shutdown = (signal: string): void => {
  console.log(`[grpc-web-proxy] ${signal} — shutting down`);
  clearInterval(_keepAlive);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

process.on('uncaughtException', (err: Error) => {
  console.error('[grpc-web-proxy] Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('[grpc-web-proxy] Unhandled rejection:', reason);
  process.exit(1);
});
