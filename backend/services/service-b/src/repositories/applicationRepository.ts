'use strict';

import Application from '../models/applicationModel';
import { IApplication } from '../models/types';
import { FindAllOptions, FindAllResult } from './types';

class ApplicationRepository {
  async findAll(opts: FindAllOptions<Record<string, unknown>> = {}): Promise<FindAllResult<IApplication>> {
    const { filter = {}, page = 1, limit = 10, sort = { createdAt: -1 } } = opts;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Application.find(filter).sort(sort as Record<string, 1 | -1>).skip(skip).limit(limit).lean() as Promise<IApplication[]>,
      Application.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<IApplication | null> {
    return Application.findById(id).lean() as Promise<IApplication | null>;
  }

  async findByUserAndJob(userId: string, jobId: string): Promise<IApplication | null> {
    return Application.findOne({ userId, jobId }).lean() as Promise<IApplication | null>;
  }

  async findByUserId(userId: string, page = 1, limit = 10): Promise<FindAllResult<IApplication>> {
    const skip = (page - 1) * limit;
    const filter = { userId };
    const [data, total] = await Promise.all([
      Application.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean() as Promise<IApplication[]>,
      Application.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findByJobId(jobId: string, page = 1, limit = 10): Promise<FindAllResult<IApplication>> {
    const skip = (page - 1) * limit;
    const filter = { jobId };
    const [data, total] = await Promise.all([
      Application.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean() as Promise<IApplication[]>,
      Application.countDocuments(filter),
    ]);
    return { data, total };
  }

  async create(payload: Partial<IApplication>): Promise<IApplication> {
    const app = await Application.create(payload);
    return app.toObject() as IApplication;
  }

  async updateStatus(id: string, applicationStatus: string): Promise<IApplication | null> {
    return Application.findByIdAndUpdate(id, { $set: { applicationStatus } }, { new: true, runValidators: true }).lean() as Promise<IApplication | null>;
  }

  async deleteById(id: string): Promise<IApplication | null> {
    return Application.findByIdAndDelete(id).lean() as Promise<IApplication | null>;
  }
}

export default new ApplicationRepository();
