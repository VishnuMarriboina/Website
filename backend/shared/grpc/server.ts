'use strict';

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import logger from '../logger';
import { GrpcServerOptions } from './types';

const PROTO_DIR = path.join(__dirname, '../../proto');

const DEFAULT_OPTIONS: protoLoader.Options = {
  keepCase:    true,
  longs:       String,
  enums:       String,
  defaults:    true,
  oneofs:      true,
  includeDirs: [PROTO_DIR],
};

export const createGrpcServer = (opts: GrpcServerOptions): Promise<grpc.Server> => {
  const { protoFile, packageName, serviceName, handlers, host = '0.0.0.0', port } = opts;

  const protoPath = path.join(PROTO_DIR, protoFile);
  const pkgDef    = protoLoader.loadSync(protoPath, DEFAULT_OPTIONS);
  const proto     = grpc.loadPackageDefinition(pkgDef) as Record<string, Record<string, { service: grpc.ServiceDefinition }>>;

  const server = new grpc.Server();
  server.addService(
    proto[packageName][serviceName].service,
    handlers as grpc.UntypedServiceImplementation
  );

  const address = `${host}:${port}`;

  return new Promise((resolve, reject) => {
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
      if (err) return reject(err);
      logger.info(`gRPC server [${serviceName}] listening on port ${boundPort}`);
      resolve(server);
    });
  });
};
