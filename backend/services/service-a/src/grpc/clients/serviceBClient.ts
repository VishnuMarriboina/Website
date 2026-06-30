'use strict';

import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import config from '../../config';
import { GrpcRequest, GrpcResponse, ServiceBClientMethods } from './types';

const PROTO_PATH = path.join(__dirname, '../../../../../proto/service-b.proto');

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

const call = (method: string, request: GrpcRequest): Promise<GrpcResponse> =>
  new Promise((resolve, reject) =>
    (getClient() as unknown as Record<string, Function>)[method](
      request,
      (err: grpc.ServiceError | null, res: GrpcResponse) => (err ? reject(err) : resolve(res))
    )
  );

const client: ServiceBClientMethods = {
  getById:      (req) => call('GetById', req),
  getAll:       (req) => call('GetAll', req),
  create:       (req) => call('Create', req),
  update:       (req) => call('Update', req),
  deleteRecord: (req) => call('Delete', req),
};

export default client;
