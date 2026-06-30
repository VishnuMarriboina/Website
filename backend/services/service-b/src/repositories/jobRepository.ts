'use strict';

import Job from '../models/jobModel';
import { IJob } from '../models/types';
import { FindAllOptions, FindAllResult } from './types';

class JobRepository {
  async findAll(opts: FindAllOptions<Record<string, unknown>> = {}): Promise<FindAllResult<IJob>> {
    const { filter = {}, page = 1, limit = 10, sort = { createdAt: -1 } } = opts;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Job.find(filter).sort(sort as Record<string, 1 | -1>).skip(skip).limit(limit).lean() as Promise<IJob[]>,
      Job.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IJob | null> {
    return Job.findById(id).lean() as Promise<IJob | null>;
  }

  async create(payload: Partial<IJob>): Promise<IJob> {
    const job = await Job.create(payload);
    return job.toObject() as IJob;
  }

  async updateById(id: string, payload: Partial<IJob>): Promise<IJob | null> {
    return Job.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true }).lean() as Promise<IJob | null>;
  }

  async deleteById(id: string): Promise<IJob | null> {
    return Job.findByIdAndDelete(id).lean() as Promise<IJob | null>;
  }

  async existsByTitle(title: string, excludeId?: string | null): Promise<boolean> {
    const filter: Record<string, unknown> = { title: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') };
    if (excludeId) filter['_id'] = { $ne: excludeId };
    return !!(await Job.exists(filter));
  }
}

export default new JobRepository();
