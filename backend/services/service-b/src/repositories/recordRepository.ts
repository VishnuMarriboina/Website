'use strict';

import Record from '../models/recordModel';
import { IRecord } from '../models/types';
import { FindAllOptions, FindAllResult } from './types';

class RecordRepository {
  async findAll(opts: FindAllOptions<Record<string, unknown>> = {}): Promise<FindAllResult<IRecord>> {
    const { filter = {}, page = 1, limit = 10, sort = { createdAt: -1 } } = opts;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Record.find(filter).sort(sort as Record<string, 1 | -1>).skip(skip).limit(limit).lean() as Promise<IRecord[]>,
      Record.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IRecord | null> {
    return Record.findById(id).lean() as Promise<IRecord | null>;
  }

  async findOne(filter: Record<string, unknown>): Promise<IRecord | null> {
    return Record.findOne(filter).lean() as Promise<IRecord | null>;
  }

  async create(payload: Partial<IRecord>): Promise<IRecord> {
    const record = await Record.create(payload);
    return record.toObject() as IRecord;
  }

  async updateById(id: string, payload: Partial<IRecord>): Promise<IRecord | null> {
    return Record.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true }).lean() as Promise<IRecord | null>;
  }

  async deleteById(id: string): Promise<IRecord | null> {
    return Record.findByIdAndDelete(id).lean() as Promise<IRecord | null>;
  }

  async existsByTitle(title: string, excludeId?: string | null): Promise<boolean> {
    const filter: Record<string, unknown> = { title: new RegExp(`^${title}$`, 'i') };
    if (excludeId) filter['_id'] = { $ne: excludeId };
    return !!(await Record.exists(filter));
  }
}

export default new RecordRepository();
