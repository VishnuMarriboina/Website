'use strict';

import prisma from '../config/prisma';
import { IOrder, IOrderProduct } from '../models/types';
import { FindAllOptions, FindAllResult } from './types';

function toIOrder(o: any): IOrder {
  return {
    id:            o.id,
    userId:        o.userId,
    products:      (o.items ?? []).map((i: any): IOrderProduct => ({
      productId:   i.productId,
      productName: i.productName,
      quantity:    i.quantity,
      price:       i.price,
    })),
    totalAmount:   o.totalAmount,
    orderStatus:   o.orderStatus,
    paymentStatus: o.paymentStatus,
    createdAt:     o.createdAt,
    updatedAt:     o.updatedAt,
  };
}

class OrderRepository {
  async findAll(opts: FindAllOptions<Record<string, unknown>> = {}): Promise<FindAllResult<IOrder>> {
    const { filter = {}, page = 1, limit = 10 } = opts;
    const skip  = (page - 1) * limit;
    const where = Object.keys(filter).length ? filter : undefined;
    const [rows, total] = await Promise.all([
      prisma.order.findMany({ where: where as any, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { items: true } }),
      prisma.order.count({ where: where as any }),
    ]);
    return { data: rows.map(toIOrder), total };
  }

  async findById(id: string): Promise<IOrder | null> {
    const o = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    return o ? toIOrder(o) : null;
  }

  async findByUserId(userId: string, page = 1, limit = 10): Promise<FindAllResult<IOrder>> {
    const skip = (page - 1) * limit;
    const [rows, total] = await Promise.all([
      prisma.order.findMany({ where: { userId }, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { items: true } }),
      prisma.order.count({ where: { userId } }),
    ]);
    return { data: rows.map(toIOrder), total };
  }

  async create(payload: Partial<IOrder>): Promise<IOrder> {
    const { products, ...rest } = payload as IOrder;
    const o = await prisma.order.create({
      data: {
        ...rest,
        items: {
          create: (products ?? []).map((p) => ({
            productId:   p.productId,
            productName: p.productName,
            quantity:    p.quantity,
            price:       p.price,
          })),
        },
      },
      include: { items: true },
    });
    return toIOrder(o);
  }

  async updateById(id: string, payload: Partial<IOrder>): Promise<IOrder | null> {
    const o = await prisma.order.update({
      where: { id },
      data:  payload as any,
      include: { items: true },
    });
    return toIOrder(o);
  }
}

export default new OrderRepository();
