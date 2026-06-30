'use strict';

import Item from '../models/itemModel';
import { IItem } from '../models/types';
import { FindAllOptions, FindAllResult } from './types';

class ItemRepository {
  async findAll(opts: FindAllOptions<Record<string, unknown>> = {}): Promise<FindAllResult<IItem>> {
    const { filter = {}, page = 1, limit = 10, sort = { createdAt: -1 } } = opts;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Item.find(filter).sort(sort as Record<string, 1 | -1>).skip(skip).limit(limit).lean() as Promise<IItem[]>,
      Item.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IItem | null> {
    return Item.findById(id).lean() as Promise<IItem | null>;
  }

  async findOne(filter: Record<string, unknown>): Promise<IItem | null> {
    return Item.findOne(filter).lean() as Promise<IItem | null>;
  }

  async create(payload: Partial<IItem>): Promise<IItem> {
    const item = await Item.create(payload);
    return item.toObject() as IItem;
  }

  async updateById(id: string, payload: Partial<IItem>): Promise<IItem | null> {
    return Item.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true }).lean() as Promise<IItem | null>;
  }

  async deleteById(id: string): Promise<IItem | null> {
    return Item.findByIdAndDelete(id).lean() as Promise<IItem | null>;
  }

  async existsByName(name: string, excludeId?: string | null): Promise<boolean> {
    const filter: Record<string, unknown> = { name: new RegExp(`^${name}$`, 'i') };
    if (excludeId) filter['_id'] = { $ne: excludeId };
    return !!(await Item.exists(filter));
  }
}

export default new ItemRepository();
