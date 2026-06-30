'use strict';

import mongoose from 'mongoose';
import config from './index';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) return;
  mongoose.connection.on('connected',    () => console.log('[service-b] MongoDB connected'));
  mongoose.connection.on('disconnected', () => console.log('[service-b] MongoDB disconnected'));
  mongoose.connection.on('error',        (err: Error) => console.error('[service-b] MongoDB error:', err));
  await mongoose.connect(config.db.uri, { serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000 });
  isConnected = true;
};

export const disconnectDB = async (): Promise<void> => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
};
