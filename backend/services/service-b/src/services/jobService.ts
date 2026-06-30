'use strict';

import jobRepository from '../repositories/jobRepository';
import { JOB_ERROR_MESSAGES, JOB_STATUS } from '../constants';
import { NotFoundError, ConflictError, BadRequestError } from '../../../../shared/errors';
import { IJob } from '../models/types';
import { GetAllJobsParams, GetAllJobsResult, CreateJobParams } from './types';

class JobService {
  async getAll(params: GetAllJobsParams = {}): Promise<GetAllJobsResult> {
    const { page, limit, status, department, search } = params;
    const filter: Record<string, unknown> = {};
    if (status)     filter['status']     = status;
    if (department) filter['department'] = new RegExp(department, 'i');
    if (search)     filter['title']      = new RegExp(search, 'i');

    const { data, total } = await jobRepository.findAll({ filter, page, limit });
    return { data, total, page: page ?? 1, limit: limit ?? 10 };
  }

  async getById(id: string): Promise<IJob> {
    if (!id) throw new BadRequestError(JOB_ERROR_MESSAGES.INVALID_ID);
    const job = await jobRepository.findById(id);
    if (!job) throw new NotFoundError(JOB_ERROR_MESSAGES.NOT_FOUND);
    return job;
  }

  async create(params: CreateJobParams): Promise<IJob> {
    const { title, description, department, location, experienceRequired, salaryRange, status } = params;
    const exists = await jobRepository.existsByTitle(title);
    if (exists) throw new ConflictError(JOB_ERROR_MESSAGES.TITLE_EXISTS);
    return jobRepository.create({ title, description, department, location, experienceRequired, salaryRange, status: status || JOB_STATUS.ACTIVE });
  }

  async update(id: string, payload: Partial<IJob>): Promise<IJob> {
    if (!id) throw new BadRequestError(JOB_ERROR_MESSAGES.INVALID_ID);
    if (payload.title) {
      const exists = await jobRepository.existsByTitle(payload.title, id);
      if (exists) throw new ConflictError(JOB_ERROR_MESSAGES.TITLE_EXISTS);
    }
    const job = await jobRepository.updateById(id, payload);
    if (!job) throw new NotFoundError(JOB_ERROR_MESSAGES.NOT_FOUND);
    return job;
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    if (!id) throw new BadRequestError(JOB_ERROR_MESSAGES.INVALID_ID);
    const job = await jobRepository.deleteById(id);
    if (!job) throw new NotFoundError(JOB_ERROR_MESSAGES.NOT_FOUND);
    return { deleted: true };
  }

  async activate(id: string): Promise<IJob> {
    if (!id) throw new BadRequestError(JOB_ERROR_MESSAGES.INVALID_ID);
    const job = await jobRepository.updateById(id, { status: JOB_STATUS.ACTIVE });
    if (!job) throw new NotFoundError(JOB_ERROR_MESSAGES.NOT_FOUND);
    return job;
  }

  async deactivate(id: string): Promise<IJob> {
    if (!id) throw new BadRequestError(JOB_ERROR_MESSAGES.INVALID_ID);
    const job = await jobRepository.updateById(id, { status: JOB_STATUS.INACTIVE });
    if (!job) throw new NotFoundError(JOB_ERROR_MESSAGES.NOT_FOUND);
    return job;
  }
}

export default new JobService();
