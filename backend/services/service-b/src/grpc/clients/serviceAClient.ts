'use strict';

import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import config from '../../config';
import { GrpcRequest, GrpcResponse, ServiceAClientMethods } from './types';

const PROTO_PATH = path.join(__dirname, '../../../../../proto/service-a.proto');

const pkgDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
});
const pkg = grpc.loadPackageDefinition(pkgDef) as Record<string, Record<string, typeof grpc.Client>>;

let _client: grpc.Client | null = null;

const getClient = (): grpc.Client => {
  if (!_client) {
    const addr = `${config.services.serviceA.host}:${config.services.serviceA.port}`;
    _client = new pkg['servicea']['ServiceA'](addr, grpc.credentials.createInsecure());
  }
  return _client;
};

const call = (method: string, request: GrpcRequest): Promise<GrpcResponse> =>
  new Promise((resolve, reject) =>
    (getClient() as unknown as Record<string, Function>)[method](
      request,
      (err: grpc.ServiceError | null, res: GrpcResponse) => (err ? reject(err) : resolve(res))
    )
  );

const client: ServiceAClientMethods = {
  healthCheck: ()    => call('HealthCheck', {}),
  getAll:      (req) => call('GetAll', req),
  getById:     (req) => call('GetById', req),
  create:      (req) => call('Create', req),
  update:      (req) => call('Update', req),
  deleteItem:  (req) => call('Delete', req),
};

export default client;
