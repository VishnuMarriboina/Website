'use strict';

import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as itemHandlers from './handlers/itemHandler';
import * as authHandlers from './handlers/authHandler';
import * as adminHandlers from './handlers/adminHandler';
import * as productHandlers from './handlers/productHandler';
import * as orderHandlers from './handlers/orderHandler';
import * as cartHandlers from './handlers/cartHandler';
import * as userHandlers from './handlers/userHandler';
import { applyLogging } from './serverLogger';
import config from '../config';

const PROTO_PATH = path.join(__dirname, '../../../../proto/service-a.proto');

export const startGrpcServer = (): Promise<grpc.Server> => {
  const pkgDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
  });
  const pkg = grpc.loadPackageDefinition(pkgDef) as Record<string, Record<string, { service: grpc.ServiceDefinition }>>;

  const server = new grpc.Server();

  const serviceImpl = applyLogging({
    ...itemHandlers,
    ...authHandlers,
    AdminLogin:        adminHandlers.AdminLogin,
    GetProducts:       productHandlers.GetProducts,
    GetProductById:    productHandlers.GetProductById,
    CreateProduct:     productHandlers.CreateProduct,
    UpdateProduct:     productHandlers.UpdateProduct,
    DeleteProduct:     productHandlers.DeleteProduct,
    ActivateProduct:   productHandlers.ActivateProduct,
    DeactivateProduct: productHandlers.DeactivateProduct,
    CreateOrder:       orderHandlers.CreateOrder,
    GetOrderById:      orderHandlers.GetOrderById,
    GetOrders:         orderHandlers.GetOrders,
    GetUserOrders:     orderHandlers.GetUserOrders,
    AddToCart:         cartHandlers.AddToCart,
    GetCart:           cartHandlers.GetCart,
    UpdateCartItem:    cartHandlers.UpdateCartItem,
    RemoveFromCart:    cartHandlers.RemoveFromCart,
    ClearCart:         cartHandlers.ClearCart,
    CheckoutCart:      cartHandlers.CheckoutCart,
    GetAllUsers:       userHandlers.GetAllUsers,
    UpdateOrderStatus: orderHandlers.UpdateOrderStatus,
  } as grpc.UntypedServiceImplementation);

  server.addService(
    pkg['servicea']['ServiceA'].service,
    serviceImpl,
  );

  const addr = `${config.grpc.host}:${config.grpc.port}`;

  return new Promise((resolve, reject) => {
    server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), (err, port) => {
      if (err) return reject(err);
      console.log(`[service-a] gRPC server listening on port ${port}`);
      resolve(server);
    });
  });
};
