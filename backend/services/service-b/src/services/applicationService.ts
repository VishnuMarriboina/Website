'use strict';

import applicationRepository from '../repositories/applicationRepository';
import jobRepository from '../repositories/jobRepository';
import { APPLICATION_ERROR_MESSAGES, JOB_ERROR_MESSAGES } from '../constants';
import { NotFoundError, ConflictError, BadRequestError } from '../../../../shared/errors';
import { IApplication } from '../models/types';
import { CreateApplicationParams, GetAllApplicationsParams, GetAllApplicationsResult } from './types';

class ApplicationService {
  async create(params: CreateApplicationParams): Promise<IApplication> {
    const { userId, jobId, resumeUrl, coverLetter } = params;

    if (!userId) throw new BadRequestError('userId is required');
    if (!jobId)  throw new BadRequestError('jobId is required');

    const job = await jobRepository.findById(jobId);
    if (!job)  throw new NotFoundError(JOB_ERROR_MESSAGES.NOT_FOUND);
    if (job.status !== 'active') throw new BadRequestError('This job posting is no longer accepting applications');

    const duplicate = await applicationRepository.findByUserAndJob(userId, jobId);
    if (duplicate) throw new ConflictError(APPLICATION_ERROR_MESSAGES.DUPLICATE);

    return applicationRepository.create({
      userId,
      jobId,
      resumeUrl:         resumeUrl   || '',
      coverLetter:       coverLetter || '',
      applicationStatus: 'pending',
    });
  }

  async getById(id: string): Promise<IApplication> {
    if (!id) throw new BadRequestError(APPLICATION_ERROR_MESSAGES.INVALID_ID);
    const app = await applicationRepository.findById(id);
    if (!app) throw new NotFoundError(APPLICATION_ERROR_MESSAGES.NOT_FOUND);
    return app;
  }

  async getAll(params: GetAllApplicationsParams = {}): Promise<GetAllApplicationsResult> {
    const { page, limit, applicationStatus } = params;
    const filter: Record<string, unknown> = {};
    if (applicationStatus) filter['applicationStatus'] = applicationStatus;

    const { data, total } = await applicationRepository.findAll({ filter, page, limit });
    return { data, total, page: page ?? 1, limit: limit ?? 10 };
  }

  async getUserApplications(userId: string, page = 1, limit = 10): Promise<GetAllApplicationsResult> {
    if (!userId) throw new BadRequestError('userId is required');
    const { data, total } = await applicationRepository.findByUserId(userId, page, limit);
    return { data, total, page, limit };
  }

  async getJobApplications(jobId: string, page = 1, limit = 10): Promise<GetAllApplicationsResult> {
    if (!jobId) throw new BadRequestError('jobId is required');
    const { data, total } = await applicationRepository.findByJobId(jobId, page, limit);
    return { data, total, page, limit };
  }

  async updateStatus(id: string, applicationStatus: string): Promise<IApplication> {
    const VALID = ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'];
    if (!id)                              throw new BadRequestError('id is required');
    if (!VALID.includes(applicationStatus)) throw new BadRequestError(`Invalid status. Allowed: ${VALID.join(', ')}`);
    const app = await applicationRepository.updateStatus(id, applicationStatus);
    if (!app) throw new NotFoundError(APPLICATION_ERROR_MESSAGES.NOT_FOUND);
    return app;
  }

  async delete(id: string): Promise<IApplication> {
    if (!id) throw new BadRequestError('id is required');
    const app = await applicationRepository.deleteById(id);
    if (!app) throw new NotFoundError(APPLICATION_ERROR_MESSAGES.NOT_FOUND);
    return app;
  }
}

export default new ApplicationService();
