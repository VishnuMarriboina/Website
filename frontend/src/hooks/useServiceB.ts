import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import serviceBClient from '../grpc/clients/serviceBClient';
import { useAuthStore } from '../store/authStore';
import type {
  GetAllRecordsParams,
  CreateRecordRequest,
  UpdateRecordRequest,
  GetJobsParams,
  CreateJobRequest,
  UpdateJobRequest,
  CreateApplicationRequest,
  GetApplicationsParams,
  UpdateApplicationStatusRequest,
} from '../grpc/clients/types';

// ── Query keys ────────────────────────────────────────────────────────────────

export const serviceBKeys = {
  health:           ['serviceb', 'health']                                   as const,
  records:          ['serviceb', 'records']                                  as const,
  recordList:       (p?: GetAllRecordsParams) => ['serviceb', 'records', 'list', p ?? {}] as const,
  recordDetail:     (id: string)             => ['serviceb', 'records', id]               as const,
  jobs:             ['serviceb', 'jobs']                                     as const,
  jobList:          (p?: GetJobsParams) => ['serviceb', 'jobs', 'list', p ?? {}]          as const,
  jobDetail:        (id: string)        => ['serviceb', 'jobs', id]                       as const,
  applications:     ['serviceb', 'applications']                             as const,
  applicationList:  (p?: GetApplicationsParams) => ['serviceb', 'applications', 'list', p ?? {}] as const,
  userApplications: (userId: string) => ['serviceb', 'applications', 'user', userId]      as const,
} as const;

// ── Record Queries ────────────────────────────────────────────────────────────

export function useServiceBHealth() {
  return useQuery({
    queryKey:        serviceBKeys.health,
    queryFn:         () => serviceBClient.healthCheck(),
    staleTime:       30_000,
    refetchInterval: 30_000,
  });
}

export function useRecords(params?: GetAllRecordsParams) {
  return useQuery({
    queryKey: serviceBKeys.recordList(params),
    queryFn:  () => serviceBClient.getAll(params ?? {}),
    staleTime: 60_000,
    gcTime:    5 * 60_000,
  });
}

export function useRecord(id: string) {
  return useQuery({
    queryKey: serviceBKeys.recordDetail(id),
    queryFn:  () => serviceBClient.getById(id),
    enabled:  !!id,
    staleTime: 60_000,
    gcTime:    5 * 60_000,
  });
}

// ── Record Mutations ──────────────────────────────────────────────────────────

export function useCreateRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateRecordRequest) => serviceBClient.create(body),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceBKeys.records }),
  });
}

export function useUpdateRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateRecordRequest) => serviceBClient.update(body),
    onSuccess:  (_, vars) => {
      qc.invalidateQueries({ queryKey: serviceBKeys.recordDetail(vars.id) });
      qc.invalidateQueries({ queryKey: serviceBKeys.records });
    },
  });
}

export function useDeleteRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceBClient.deleteRecord(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceBKeys.records }),
  });
}

// ── Job Queries ───────────────────────────────────────────────────────────────

export function useJobs(params?: GetJobsParams) {
  return useQuery({
    queryKey: serviceBKeys.jobList(params),
    queryFn:  () => serviceBClient.getJobs(params ?? {}),
    staleTime: 60_000,
    gcTime:    5 * 60_000,
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: serviceBKeys.jobDetail(id),
    queryFn:  () => serviceBClient.getJobById(id),
    enabled:  !!id,
    staleTime: 60_000,
    gcTime:    5 * 60_000,
  });
}

// ── Job Mutations ─────────────────────────────────────────────────────────────

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateJobRequest) => serviceBClient.createJob(body),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceBKeys.jobs }),
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateJobRequest) => serviceBClient.updateJob(body),
    onSuccess:  (_, vars) => {
      qc.invalidateQueries({ queryKey: serviceBKeys.jobDetail(vars.id) });
      qc.invalidateQueries({ queryKey: serviceBKeys.jobs });
    },
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceBClient.deleteJob(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceBKeys.jobs }),
  });
}

export function useActivateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceBClient.activateJob(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceBKeys.jobs }),
  });
}

export function useDeactivateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceBClient.deactivateJob(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceBKeys.jobs }),
  });
}

// ── Application Queries ───────────────────────────────────────────────────────

export function useApplications(params?: GetApplicationsParams) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: serviceBKeys.applicationList(params),
    queryFn:  () => serviceBClient.getApplications(params ?? {}),
    enabled:  !!token,
    staleTime: 30_000,
    gcTime:    5 * 60_000,
  });
}

export function useUserApplications(userId: string) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: serviceBKeys.userApplications(userId),
    queryFn:  () => serviceBClient.getUserApplications(userId),
    enabled:  !!token && !!userId,
    staleTime: 30_000,
    gcTime:    5 * 60_000,
  });
}

// ── Application Mutations ─────────────────────────────────────────────────────

export function useCreateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateApplicationRequest) => serviceBClient.createApplication(body),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceBKeys.applications }),
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateApplicationStatusRequest) => serviceBClient.updateApplicationStatus(body),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceBKeys.applications }),
  });
}

export function useDeleteApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceBClient.deleteApplication(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceBKeys.applications }),
  });
}
