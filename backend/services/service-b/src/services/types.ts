import { IRecord, IJob, IApplication } from '../models/types';

export interface GetAllRecordsParams {
  page?:   number;
  limit?:  number;
  status?: string;
  refId?:  string;
}

export interface GetAllRecordsResult {
  data:  IRecord[];
  total: number;
}

export interface CreateRecordParams {
  title:   string;
  content: string;
  status:  string;
  refId:   string;
}

export interface UpdateRecordPayload {
  title?:   string;
  content?: string;
  status?:  string;
}

// ── Job ───────────────────────────────────────────────────────────────────────

export interface GetAllJobsParams {
  page?:       number;
  limit?:      number;
  status?:     string;
  department?: string;
  search?:     string;
}

export interface GetAllJobsResult {
  data:  IJob[];
  total: number;
  page:  number;
  limit: number;
}

export interface CreateJobParams {
  title:              string;
  description:        string;
  department:         string;
  location:           string;
  experienceRequired: string;
  salaryRange:        string;
  status:             string;
}

// ── Application ───────────────────────────────────────────────────────────────

export interface CreateApplicationParams {
  userId:      string;
  jobId:       string;
  resumeUrl:   string;
  coverLetter: string;
}

export interface GetAllApplicationsParams {
  page?:              number;
  limit?:             number;
  applicationStatus?: string;
}

export interface GetAllApplicationsResult {
  data:  IApplication[];
  total: number;
  page:  number;
  limit: number;
}
