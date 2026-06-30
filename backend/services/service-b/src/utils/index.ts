'use strict';

import { IRecord, IJob, IApplication } from '../models/types';
import { GrpcRecordDto, GrpcJobDto, GrpcApplicationDto } from './types';

export const recordToGrpc = (record: IRecord): GrpcRecordDto => ({
  id:        record._id?.toString() ?? record.id ?? '',
  title:     record.title     ?? '',
  content:   record.content   ?? '',
  status:    record.status    ?? 'active',
  refId:     record.refId     ?? '',
  createdAt: record.createdAt ? new Date(record.createdAt).toISOString() : '',
  updatedAt: record.updatedAt ? new Date(record.updatedAt).toISOString() : '',
});

export const jobToGrpc = (job: IJob): GrpcJobDto => ({
  id:                 job._id?.toString() ?? job.id ?? '',
  title:              job.title              ?? '',
  description:        job.description        ?? '',
  department:         job.department         ?? '',
  location:           job.location           ?? '',
  experienceRequired: job.experienceRequired ?? '',
  salaryRange:        job.salaryRange        ?? '',
  status:             job.status             ?? 'active',
  createdAt:          job.createdAt          ? new Date(job.createdAt).toISOString() : '',
  updatedAt:          job.updatedAt          ? new Date(job.updatedAt).toISOString() : '',
});

export const applicationToGrpc = (app: IApplication): GrpcApplicationDto => ({
  id:                app._id?.toString() ?? app.id ?? '',
  userId:            app.userId            ?? '',
  jobId:             app.jobId             ?? '',
  resumeUrl:         app.resumeUrl         ?? '',
  coverLetter:       app.coverLetter       ?? '',
  applicationStatus: app.applicationStatus ?? 'pending',
  createdAt:         app.createdAt         ? new Date(app.createdAt).toISOString() : '',
});
