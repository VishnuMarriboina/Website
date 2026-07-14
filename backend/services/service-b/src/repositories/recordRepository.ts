'use strict';

import prisma from '../config/prisma';
import { IRecord } from '../models/types';
import { FindAllOptions, FindAllResult } from './types';

class RecordRepository {
  async findAll(opts: FindAllOptions<Record<string, unknown>> = {}): Promise<FindAllResult<IRecord>> {
    const { filter = {}, page = 1, limit = 10 } = opts;
    const skip  = (page - 1) * limit;
    const where = Object.keys(filter).length ? filter : undefined;
    const [data, total] = await Promise.all([
      prisma.record.findMany({ where: where as any, skip, take: limit, orderBy: { createdAt: 'desc' } }) as Promise<IRecord[]>,
      prisma.record.count({ where: where as any }),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IRecord | null> {
    return prisma.record.findUnique({ where: { id } }) as Promise<IRecord | null>;
  }

  async findOne(filter: Record<string, unknown>): Promise<IRecord | null> {
    return prisma.record.findFirst({ where: filter as any }) as Promise<IRecord | null>;
  }

  async create(payload: Partial<IRecord>): Promise<IRecord> {
    return prisma.record.create({ data: payload as any }) as Promise<IRecord>;
  }

  async updateById(id: string, payload: Partial<IRecord>): Promise<IRecord | null> {
    return prisma.record.update({ where: { id }, data: payload as any }) as Promise<IRecord>;
  }

  async deleteById(id: string): Promise<IRecord | null> {
    return prisma.record.delete({ where: { id } }) as Promise<IRecord>;
  }

  async existsByTitle(title: string, excludeId?: string | null): Promise<boolean> {
    const record = await prisma.record.findFirst({
      where: {
        title: { equals: title },
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !!record;
  }
}

export default new RecordRepository();
