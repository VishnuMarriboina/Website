'use strict';

import Order from '../models/orderModel';
import { IOrder } from '../models/types';
import { FindAllOptions, FindAllResult } from './types';

class OrderRepository {
  async findAll(opts: FindAllOptions<Record<string, unknown>> = {}): Promise<FindAllResult<IOrder>> {
    const { filter = {}, page = 1, limit = 10, sort = { createdAt: -1 } } = opts;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Order.find(filter).sort(sort as Record<string, 1 | -1>).skip(skip).limit(limit).lean() as Promise<IOrder[]>,
      Order.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IOrder | null> {
    return Order.findById(id).lean() as Promise<IOrder | null>;
  }

  async findByUserId(userId: string, page = 1, limit = 10): Promise<FindAllResult<IOrder>> {
    const skip = (page - 1) * limit;
    const filter = { userId };
    const [data, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean() as Promise<IOrder[]>,
      Order.countDocuments(filter),
    ]);
    return { data, total };
  }

  async create(payload: Partial<IOrder>): Promise<IOrder> {
    const order = await Order.create(payload);
    return order.toObject() as IOrder;
  }

  async updateById(id: string, payload: Partial<IOrder>): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true }).lean() as Promise<IOrder | null>;
  }
}

export default new OrderRepository();
