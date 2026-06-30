'use strict';

import Product from '../models/productModel';
import { IProduct } from '../models/types';
import { FindAllOptions, FindAllResult } from './types';

class ProductRepository {
  async findAll(opts: FindAllOptions<Record<string, unknown>> = {}): Promise<FindAllResult<IProduct>> {
    const { filter = {}, page = 1, limit = 10, sort = { createdAt: -1 } } = opts;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Product.find(filter).sort(sort as Record<string, 1 | -1>).skip(skip).limit(limit).lean() as Promise<IProduct[]>,
      Product.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IProduct | null> {
    return Product.findById(id).lean() as Promise<IProduct | null>;
  }

  async findOne(filter: Record<string, unknown>): Promise<IProduct | null> {
    return Product.findOne(filter).lean() as Promise<IProduct | null>;
  }

  async create(payload: Partial<IProduct>): Promise<IProduct> {
    const product = await Product.create(payload);
    return product.toObject() as IProduct;
  }

  async updateById(id: string, payload: Partial<IProduct>): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true }).lean() as Promise<IProduct | null>;
  }

  async deleteById(id: string): Promise<IProduct | null> {
    return Product.findByIdAndDelete(id).lean() as Promise<IProduct | null>;
  }

  async existsByName(name: string, excludeId?: string | null): Promise<boolean> {
    const filter: Record<string, unknown> = { name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') };
    if (excludeId) filter['_id'] = { $ne: excludeId };
    return !!(await Product.exists(filter));
  }

  async decrementStock(id: string, quantity: number): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(
      id,
      { $inc: { stock: -quantity } },
      { new: true, runValidators: true }
    ).lean() as Promise<IProduct | null>;
  }
}

export default new ProductRepository();
