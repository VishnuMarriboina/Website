'use strict';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const logger = require('../logger');

const PROTO_DIR = path.join(__dirname, '../../proto');

const DEFAULT_OPTIONS = {
  keepCase:             true,
  longs:                String,
  enums:                String,
  defaults:             true,
  oneofs:               true,
  includeDirs:          [PROTO_DIR],
};

/**
 * Create a gRPC server.
 * @param {string}   protoFile   - filename inside /proto (e.g. 'service-a.proto')
 * @param {string}   packageName - proto package (e.g. 'servicea')
 * @param {string}   serviceName - service defined in proto (e.g. 'ServiceA')
 * @param {object}   handlers    - { methodName: fn(call, callback) }
 * @param {string}   host        - bind address (default '0.0.0.0')
 * @param {number}   port        - port number
 * @returns {grpc.Server}
 */
const createGrpcServer = ({ protoFile, packageName, serviceName, handlers, host = '0.0.0.0', port }) => {
  const protoPath = path.join(PROTO_DIR, protoFile);
  const pkgDef   = protoLoader.loadSync(protoPath, DEFAULT_OPTIONS);
  const proto    = grpc.loadPackageDefinition(pkgDef)[packageName];

  const server = new grpc.Server();
  server.addService(proto[serviceName].service, handlers);

  const address = `${host}:${port}`;

  return new Promise((resolve, reject) => {
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
      if (err) return reject(err);
      logger.info(`gRPC server [${serviceName}] listening on port ${boundPort}`);
      resolve(server);
    });
  });
};

module.exports = { createGrpcServer };
