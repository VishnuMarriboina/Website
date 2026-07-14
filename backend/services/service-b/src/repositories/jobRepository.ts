'use strict';

import prisma from '../config/prisma';
import { IJob } from '../models/types';
import { FindAllOptions, FindAllResult } from './types';

class JobRepository {
  async findAll(opts: FindAllOptions<Record<string, unknown>> = {}): Promise<FindAllResult<IJob>> {
    const { filter = {}, page = 1, limit = 10 } = opts;
    const skip  = (page - 1) * limit;
    const where = Object.keys(filter).length ? filter : undefined;
    const [data, total] = await Promise.all([
      prisma.job.findMany({ where: where as any, skip, take: limit, orderBy: { createdAt: 'desc' } }) as Promise<IJob[]>,
      prisma.job.count({ where: where as any }),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IJob | null> {
    return prisma.job.findUnique({ where: { id } }) as Promise<IJob | null>;
  }

  async create(payload: Partial<IJob>): Promise<IJob> {
    return prisma.job.create({ data: payload as any }) as Promise<IJob>;
  }

  async updateById(id: string, payload: Partial<IJob>): Promise<IJob | null> {
    return prisma.job.update({ where: { id }, data: payload as any }) as Promise<IJob>;
  }

  async deleteById(id: string): Promise<IJob | null> {
    return prisma.job.delete({ where: { id } }) as Promise<IJob>;
  }

  async existsByTitle(title: string, excludeId?: string | null): Promise<boolean> {
    const job = await prisma.job.findFirst({
      where: {
        title: { equals: title },
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !!job;
  }
}

export default new JobRepository();
