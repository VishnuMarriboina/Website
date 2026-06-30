'use strict';

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import logger from '../logger';
import { GrpcClientOptions } from './types';

const PROTO_DIR = path.join(__dirname, '../../proto');

const DEFAULT_OPTIONS: protoLoader.Options = {
  keepCase:    true,
  longs:       String,
  enums:       String,
  defaults:    true,
  oneofs:      true,
  includeDirs: [PROTO_DIR],
};

const clientCache = new Map<string, grpc.Client>();

export const getGrpcClient = (opts: GrpcClientOptions): grpc.Client => {
  const { protoFile, packageName, serviceName, host, port } = opts;
  const key = `${serviceName}:${host}:${port}`;

  if (clientCache.has(key)) return clientCache.get(key)!;

  const protoPath = path.join(PROTO_DIR, protoFile);
  const pkgDef    = protoLoader.loadSync(protoPath, DEFAULT_OPTIONS);
  const proto     = grpc.loadPackageDefinition(pkgDef) as Record<string, Record<string, typeof grpc.Client>>;

  const address = `${host}:${port}`;
  const client  = new proto[packageName][serviceName](address, grpc.credentials.createInsecure());

  logger.info(`gRPC client created → ${serviceName} @ ${address}`);
  clientCache.set(key, client);
  return client;
};

export const callGrpc = (
  client: grpc.Client,
  method: string,
  request: Record<string, unknown>,
  metadata: Record<string, string> = {}
): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const meta = new grpc.Metadata();
    Object.entries(metadata).forEach(([k, v]) => meta.add(k, v));

    (client as unknown as Record<string, Function>)[method](request, meta, (err: grpc.ServiceError | null, response: unknown) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
