'use strict';

import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import config from '../config';
import { GrpcRequest, GrpcResponse, GrpcMetadata, ServiceBClient } from './types';

const PROTO_PATH = path.join(__dirname, '../../../proto/service-b.proto');

const pkgDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
});
const pkg = grpc.loadPackageDefinition(pkgDef) as Record<string, Record<string, typeof grpc.Client>>;

let _client: grpc.Client | null = null;

const getClient = (): grpc.Client => {
  if (!_client) {
    const addr = `${config.services.serviceB.host}:${config.services.serviceB.port}`;
    _client = new pkg['serviceb']['ServiceB'](addr, grpc.credentials.createInsecure());
  }
  return _client;
};

const call = (method: string, request: GrpcRequest, metadata: GrpcMetadata = {}): Promise<GrpcResponse> => {
  const meta = new grpc.Metadata();
  Object.entries(metadata).forEach(([k, v]) => meta.add(k, v));
  return new Promise((resolve, reject) =>
    (getClient() as unknown as Record<string, Function>)[method](
      request,
      meta,
      (err: grpc.ServiceError | null, res: GrpcResponse) => (err ? reject(err) : resolve(res))
    )
  );
};

const client: ServiceBClient = {
  // Legacy
  healthCheck:         (r = {}, m) => call('HealthCheck', r, m),
  getById:             (r, m)      => call('GetById', r, m),
  getAll:              (r, m)      => call('GetAll', r, m),
  create:              (r, m)      => call('Create', r, m),
  update:              (r, m)      => call('Update', r, m),
  deleteRecord:        (r, m)      => call('Delete', r, m),
  // Job
  getJobs:             (r, m)      => call('GetJobs', r, m),
  getJobById:          (r, m)      => call('GetJobById', r, m),
  createJob:           (r, m)      => call('CreateJob', r, m),
  updateJob:           (r, m)      => call('UpdateJob', r, m),
  deleteJob:           (r, m)      => call('DeleteJob', r, m),
  activateJob:         (r, m)      => call('ActivateJob', r, m),
  deactivateJob:       (r, m)      => call('DeactivateJob', r, m),
  // Application
  createApplication:   (r, m)      => call('CreateApplication', r, m),
  getApplicationById:  (r, m)      => call('GetApplicationById', r, m),
  getApplications:     (r, m)      => call('GetApplications', r, m),
  getUserApplications: (r, m)      => call('GetUserApplications', r, m),
  getJobApplications:         (r, m) => call('GetJobApplications', r, m),
  updateApplicationStatus:    (r, m) => call('UpdateApplicationStatus', r, m),
  deleteApplication:          (r, m) => call('DeleteApplication', r, m),
};

export default client;
