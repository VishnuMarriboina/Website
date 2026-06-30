'use strict';

import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import config from '../config';
import { GrpcRequest, GrpcResponse, GrpcMetadata, ServiceAClient } from './types';

const PROTO_PATH = path.join(__dirname, '../../../proto/service-a.proto');

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

const client: ServiceAClient = {
  // Legacy
  healthCheck:       (r = {}, m) => call('HealthCheck', r, m),
  getById:           (r, m)      => call('GetById', r, m),
  getAll:            (r, m)      => call('GetAll', r, m),
  create:            (r, m)      => call('Create', r, m),
  update:            (r, m)      => call('Update', r, m),
  deleteItem:        (r, m)      => call('Delete', r, m),
  register:          (r, m)      => call('Register', r, m),
  login:             (r, m)      => call('Login', r, m),
  // Admin
  adminLogin:        (r, m)      => call('AdminLogin', r, m),
  // Product
  getProducts:       (r, m)      => call('GetProducts', r, m),
  getProductById:    (r, m)      => call('GetProductById', r, m),
  createProduct:     (r, m)      => call('CreateProduct', r, m),
  updateProduct:     (r, m)      => call('UpdateProduct', r, m),
  deleteProduct:     (r, m)      => call('DeleteProduct', r, m),
  activateProduct:   (r, m)      => call('ActivateProduct', r, m),
  deactivateProduct: (r, m)      => call('DeactivateProduct', r, m),
  // Order
  createOrder:       (r, m)      => call('CreateOrder', r, m),
  getOrderById:      (r, m)      => call('GetOrderById', r, m),
  getOrders:         (r, m)      => call('GetOrders', r, m),
  getUserOrders:     (r, m)      => call('GetUserOrders', r, m),
  // Cart
  addToCart:         (r, m)      => call('AddToCart', r, m),
  getCart:           (r = {}, m) => call('GetCart', r, m),
  updateCartItem:    (r, m)      => call('UpdateCartItem', r, m),
  removeFromCart:    (r, m)      => call('RemoveFromCart', r, m),
  clearCart:         (r = {}, m) => call('ClearCart', r, m),
  checkoutCart:      (r = {}, m) => call('CheckoutCart', r, m),
  // User management (admin)
  getAllUsers:        (r, m)      => call('GetAllUsers', r, m),
  // Order status (admin)
  updateOrderStatus: (r, m)      => call('UpdateOrderStatus', r, m),
};

export default client;
