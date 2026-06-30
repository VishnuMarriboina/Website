'use strict';

import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as handlers from './handlers/recordHandler';
import * as jobHandlers from './handlers/jobHandler';
import * as applicationHandlers from './handlers/applicationHandler';
import config from '../config';

const PROTO_PATH = path.join(__dirname, '../../../../proto/service-b.proto');

export const startGrpcServer = (): Promise<grpc.Server> => {
  const pkgDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
  });
  const pkg = grpc.loadPackageDefinition(pkgDef) as Record<string, Record<string, { service: grpc.ServiceDefinition }>>;

  const server = new grpc.Server();
  server.addService(
    pkg['serviceb']['ServiceB'].service,
    {
      ...handlers,
      GetJobs:             jobHandlers.GetJobs,
      GetJobById:          jobHandlers.GetJobById,
      CreateJob:           jobHandlers.CreateJob,
      UpdateJob:           jobHandlers.UpdateJob,
      DeleteJob:           jobHandlers.DeleteJob,
      ActivateJob:         jobHandlers.ActivateJob,
      DeactivateJob:       jobHandlers.DeactivateJob,
      CreateApplication:       applicationHandlers.CreateApplication,
      GetApplicationById:      applicationHandlers.GetApplicationById,
      GetApplications:         applicationHandlers.GetApplications,
      GetUserApplications:     applicationHandlers.GetUserApplications,
      GetJobApplications:      applicationHandlers.GetJobApplications,
      UpdateApplicationStatus: applicationHandlers.UpdateApplicationStatus,
      DeleteApplication:       applicationHandlers.DeleteApplication,
    } as grpc.UntypedServiceImplementation
  );

  const addr = `${config.grpc.host}:${config.grpc.port}`;

  return new Promise((resolve, reject) =>
    server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), (err, port) => {
      if (err) return reject(err);
      console.log(`[service-b] gRPC server listening on port ${port}`);
      resolve(server);
    })
  );
};
