'use strict';

import prisma from '../config/prisma';
import { IProduct } from '../models/types';
import { FindAllOptions, FindAllResult } from './types';

class ProductRepository {
  async findAll(opts: FindAllOptions<Record<string, unknown>> = {}): Promise<FindAllResult<IProduct>> {
    const { filter = {}, page = 1, limit = 10 } = opts;
    const skip = (page - 1) * limit;
    const where = Object.keys(filter).length ? filter : undefined;
    const [data, total] = await Promise.all([
      prisma.product.findMany({ where: where as any, skip, take: limit, orderBy: { createdAt: 'desc' } }) as Promise<IProduct[]>,
      prisma.product.count({ where: where as any }),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IProduct | null> {
    return prisma.product.findUnique({ where: { id } }) as Promise<IProduct | null>;
  }

  async findOne(filter: Record<string, unknown>): Promise<IProduct | null> {
    return prisma.product.findFirst({ where: filter as any }) as Promise<IProduct | null>;
  }

  async create(payload: Partial<IProduct>): Promise<IProduct> {
    return prisma.product.create({ data: payload as any }) as Promise<IProduct>;
  }

  async updateById(id: string, payload: Partial<IProduct>): Promise<IProduct | null> {
    return prisma.product.update({ where: { id }, data: payload as any }) as Promise<IProduct>;
  }

  async deleteById(id: string): Promise<IProduct | null> {
    return prisma.product.delete({ where: { id } }) as Promise<IProduct>;
  }

  async existsByName(name: string, excludeId?: string | null): Promise<boolean> {
    const product = await prisma.product.findFirst({
      where: {
        name: { equals: name },
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !!product;
  }

  async decrementStock(id: string, quantity: number): Promise<IProduct | null> {
    return prisma.product.update({
      where: { id },
      data:  { stock: { decrement: quantity } },
    }) as Promise<IProduct>;
  }
}

export default new ProductRepository();
