'use strict';

import prisma from '../config/prisma';
import { IApplication } from '../models/types';
import { FindAllOptions, FindAllResult } from './types';

class ApplicationRepository {
  async findAll(opts: FindAllOptions<Record<string, unknown>> = {}): Promise<FindAllResult<IApplication>> {
    const { filter = {}, page = 1, limit = 10 } = opts;
    const skip  = (page - 1) * limit;
    const where = Object.keys(filter).length ? filter : undefined;
    const [data, total] = await Promise.all([
      prisma.application.findMany({ where: where as any, skip, take: limit, orderBy: { createdAt: 'desc' } }) as Promise<IApplication[]>,
      prisma.application.count({ where: where as any }),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IApplication | null> {
    return prisma.application.findUnique({ where: { id } }) as Promise<IApplication | null>;
  }

  async findByUserAndJob(userId: string, jobId: string): Promise<IApplication | null> {
    return prisma.application.findUnique({
      where: { userId_jobId: { userId, jobId } },
    }) as Promise<IApplication | null>;
  }

  async findByUserId(userId: string, page = 1, limit = 10): Promise<FindAllResult<IApplication>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.application.findMany({ where: { userId }, skip, take: limit, orderBy: { createdAt: 'desc' } }) as Promise<IApplication[]>,
      prisma.application.count({ where: { userId } }),
    ]);
    return { data, total };
  }

  async findByJobId(jobId: string, page = 1, limit = 10): Promise<FindAllResult<IApplication>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.application.findMany({ where: { jobId }, skip, take: limit, orderBy: { createdAt: 'desc' } }) as Promise<IApplication[]>,
      prisma.application.count({ where: { jobId } }),
    ]);
    return { data, total };
  }

  async create(payload: Partial<IApplication>): Promise<IApplication> {
    return prisma.application.create({ data: payload as any }) as Promise<IApplication>;
  }

  async updateStatus(id: string, applicationStatus: string): Promise<IApplication | null> {
    return prisma.application.update({ where: { id }, data: { applicationStatus } }) as Promise<IApplication>;
  }

  async deleteById(id: string): Promise<IApplication | null> {
    return prisma.application.delete({ where: { id } }) as Promise<IApplication>;
  }
}

export default new ApplicationRepository();
