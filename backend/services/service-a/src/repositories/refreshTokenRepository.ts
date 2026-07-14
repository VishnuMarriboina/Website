'use strict';

import prisma from '../config/prisma';

export const create = (tokenHash: string, subjectId: string, subjectType: string, expiresAt: Date) =>
  prisma.refreshToken.create({ data: { tokenHash, subjectId, subjectType, expiresAt } });

export const findValidByHash = (tokenHash: string) =>
  prisma.refreshToken.findFirst({
    where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
  });

export const revokeByHash = (tokenHash: string) =>
  prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
