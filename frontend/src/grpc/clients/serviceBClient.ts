import protobuf from 'protobufjs/light';
import { SERVICE_B_DESCRIPTOR } from '../proto/serviceB';
import { grpcWebCall } from '../transport';
import type {
  IServiceBClient,
  GetAllRecordsParams,
  CreateRecordRequest,
  UpdateRecordRequest,
  RecordListResponse,
  RecordResponse,
  GetJobsParams,
  CreateJobRequest,
  UpdateJobRequest,
  JobListResponse,
  JobResponse,
  CreateApplicationRequest,
  GetApplicationsParams,
  ApplicationResponse,
  ApplicationListResponse,
  UpdateApplicationStatusRequest,
} from './types';
import type { HealthCheckResponse, StatusResponse } from '../types';

const root = protobuf.Root.fromJSON(SERVICE_B_DESCRIPTOR as protobuf.INamespace).resolveAll();
const t = (name: string): protobuf.Type => root.lookupType(`serviceb.${name}`);

const SERVICE = 'serviceb.ServiceB';

const serviceBClient: IServiceBClient = {
  // Legacy records
  healthCheck:  ()       => grpcWebCall<HealthCheckResponse>(SERVICE, 'HealthCheck', t('HealthCheckRequest'),    t('HealthCheckResponse'), {}),
  getAll:       (params: GetAllRecordsParams)    => grpcWebCall<RecordListResponse>(SERVICE, 'GetAll',      t('GetAllRequest'),         t('GetAllResponse'),      params),
  getById:      (id: string)                    => grpcWebCall<RecordResponse>    (SERVICE, 'GetById',     t('GetByIdRequest'),        t('RecordResponse'),      { id }),
  create:       (body: CreateRecordRequest)     => grpcWebCall<RecordResponse>    (SERVICE, 'Create',      t('CreateRecordRequest'),   t('RecordResponse'),      body),
  update:       (body: UpdateRecordRequest)     => grpcWebCall<RecordResponse>    (SERVICE, 'Update',      t('UpdateRecordRequest'),   t('RecordResponse'),      body),
  deleteRecord: (id: string)                    => grpcWebCall<StatusResponse>    (SERVICE, 'Delete',      t('DeleteRecordRequest'),   t('StatusResponse'),      { id }),
  // Jobs
  getJobs:       (params: GetJobsParams)         => grpcWebCall<JobListResponse>   (SERVICE, 'GetJobs',       t('GetJobsRequest'),        t('GetJobsResponse'),     params),
  getJobById:    (id: string)                    => grpcWebCall<JobResponse>       (SERVICE, 'GetJobById',    t('GetByIdRequest'),        t('JobResponse'),         { id }),
  createJob:     (body: CreateJobRequest)        => grpcWebCall<JobResponse>       (SERVICE, 'CreateJob',     t('CreateJobRequest'),      t('JobResponse'),         body),
  updateJob:     (body: UpdateJobRequest)        => grpcWebCall<JobResponse>       (SERVICE, 'UpdateJob',     t('UpdateJobRequest'),      t('JobResponse'),         body),
  deleteJob:     (id: string)                    => grpcWebCall<StatusResponse>    (SERVICE, 'DeleteJob',     t('DeleteRecordRequest'),   t('StatusResponse'),      { id }),
  activateJob:   (id: string)                    => grpcWebCall<JobResponse>       (SERVICE, 'ActivateJob',   t('GetByIdRequest'),        t('JobResponse'),         { id }),
  deactivateJob: (id: string)                    => grpcWebCall<JobResponse>       (SERVICE, 'DeactivateJob', t('GetByIdRequest'),        t('JobResponse'),         { id }),
  // Applications
  createApplication:   (body: CreateApplicationRequest) => grpcWebCall<ApplicationResponse>    (SERVICE, 'CreateApplication',   t('CreateApplicationRequest'), t('ApplicationResponse'),     body),
  getApplicationById:  (id: string)                     => grpcWebCall<ApplicationResponse>    (SERVICE, 'GetApplicationById',  t('GetByIdRequest'),           t('ApplicationResponse'),     { id }),
  getApplications:     (params: GetApplicationsParams)  => grpcWebCall<ApplicationListResponse>(SERVICE, 'GetApplications',     t('GetApplicationsRequest'),   t('GetApplicationsResponse'), params),
  getUserApplications: (userId: string)                 => grpcWebCall<ApplicationListResponse>(SERVICE, 'GetUserApplications', t('GetUserAppRequest'),        t('GetApplicationsResponse'), { userId }),
  getJobApplications:      (jobId: string)                               => grpcWebCall<ApplicationListResponse>(SERVICE, 'GetJobApplications',      t('GetByIdRequest'),                      t('GetApplicationsResponse'), { id: jobId }),
  updateApplicationStatus: (body: UpdateApplicationStatusRequest)        => grpcWebCall<ApplicationResponse>    (SERVICE, 'UpdateApplicationStatus', t('UpdateApplicationStatusRequest'),       t('ApplicationResponse'),     body),
  deleteApplication:       (id: string)                                  => grpcWebCall<import('../types').StatusResponse>(SERVICE, 'DeleteApplication', t('GetByIdRequest'), t('StatusResponse'), { id }),
};

export default serviceBClient;
