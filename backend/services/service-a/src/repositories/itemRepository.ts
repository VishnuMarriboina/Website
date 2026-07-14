'use strict';

import prisma from '../config/prisma';
import { IItem } from '../models/types';
import { FindAllOptions, FindAllResult } from './types';

class ItemRepository {
  async findAll(opts: FindAllOptions<Record<string, unknown>> = {}): Promise<FindAllResult<IItem>> {
    const { filter = {}, page = 1, limit = 10 } = opts;
    const skip = (page - 1) * limit;
    const where = buildWhere(filter);
    const [data, total] = await Promise.all([
      prisma.item.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }) as Promise<IItem[]>,
      prisma.item.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IItem | null> {
    return prisma.item.findUnique({ where: { id } }) as Promise<IItem | null>;
  }

  async findOne(filter: Record<string, unknown>): Promise<IItem | null> {
    return prisma.item.findFirst({ where: buildWhere(filter) }) as Promise<IItem | null>;
  }

  async create(payload: Partial<IItem>): Promise<IItem> {
    return prisma.item.create({ data: payload as any }) as Promise<IItem>;
  }

  async updateById(id: string, payload: Partial<IItem>): Promise<IItem | null> {
    return prisma.item.update({ where: { id }, data: payload as any }) as Promise<IItem>;
  }

  async deleteById(id: string): Promise<IItem | null> {
    return prisma.item.delete({ where: { id } }) as Promise<IItem>;
  }

  async existsByName(name: string, excludeId?: string | null): Promise<boolean> {
    const item = await prisma.item.findFirst({
      where: {
        name: { equals: name },
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !!item;
  }
}

function buildWhere(filter: Record<string, unknown>) {
  return Object.keys(filter).length ? filter : undefined;
}

export default new ItemRepository();
