'use strict';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const logger = require('../logger');

const PROTO_DIR = path.join(__dirname, '../../proto');

const DEFAULT_OPTIONS = {
  keepCase:    true,
  longs:       String,
  enums:       String,
  defaults:    true,
  oneofs:      true,
  includeDirs: [PROTO_DIR],
};

const clientCache = new Map();

/**
 * Get (or create) a cached gRPC client stub.
 * @param {string} protoFile    - filename inside /proto
 * @param {string} packageName  - proto package name
 * @param {string} serviceName  - service name in proto
 * @param {string} host         - remote host
 * @param {number} port         - remote port
 */
const getGrpcClient = ({ protoFile, packageName, serviceName, host, port }) => {
  const key = `${serviceName}:${host}:${port}`;

  if (clientCache.has(key)) return clientCache.get(key);

  const protoPath = path.join(PROTO_DIR, protoFile);
  const pkgDef   = protoLoader.loadSync(protoPath, DEFAULT_OPTIONS);
  const proto    = grpc.loadPackageDefinition(pkgDef)[packageName];

  const address = `${host}:${port}`;
  const client  = new proto[serviceName](address, grpc.credentials.createInsecure());

  logger.info(`gRPC client created → ${serviceName} @ ${address}`);
  clientCache.set(key, client);
  return client;
};

/**
 * Promisify a unary gRPC call.
 */
const callGrpc = (client, method, request, metadata = {}) =>
  new Promise((resolve, reject) => {
    const meta = new grpc.Metadata();
    Object.entries(metadata).forEach(([k, v]) => meta.add(k, v));

    client[method](request, meta, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });

module.exports = { getGrpcClient, callGrpc };
