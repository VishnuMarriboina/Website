'use strict';

import prisma from './prisma';

export const connectDB = async (): Promise<void> => {
  await prisma.$connect();
  console.log('[service-b] MySQL connected');
};

export const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
  console.log('[service-b] MySQL disconnected');
};
