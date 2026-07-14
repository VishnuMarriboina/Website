'use strict';

import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

import { connectDB, disconnectDB } from './config/database';
import { startGrpcServer } from './grpc/server';

process.on('uncaughtException', (err: Error) => {
  console.error('[service-a] Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('[service-a] Unhandled rejection:', reason);
  process.exit(1);
});

const bootstrap = async (): Promise<void> => {
  await connectDB();
  await startGrpcServer();

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`[service-a] ${signal} — shutting down`);
    await disconnectDB();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
};

bootstrap().catch((err: Error) => {
  console.error('[service-a] Startup failed:', err);
  process.exit(1);
});
