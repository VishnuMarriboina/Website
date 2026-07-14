'use strict';

import path from 'path';
import * as protobuf from 'protobufjs';
import type { Request, Response } from 'express';
import serviceA from './grpc-clients/serviceAClient';
import serviceB from './grpc-clients/serviceBClient';
import { ServiceMap, ServiceEntry } from './types';
import { GrpcRequest, GrpcMetadata } from './grpc-clients/types';
import {
  generateProxyId,
  logRequest,
  logResponse,
  logError,
  logDecodeError,
} from './grpcLogger';
import { checkRateLimit } from './rateLimiter';
import config from './config';

// Auth RPCs are the brute-forceable surface — rate limit by client IP regardless
// of which downstream service/method they hit.
const RATE_LIMITED_METHODS = new Set(['Login', 'Register', 'AdminLogin', 'RefreshToken']);

const PROTO_DIR = path.join(__dirname, '../../proto');

const rootA = protobuf.loadSync(path.join(PROTO_DIR, 'service-a.proto'));
const rootB = protobuf.loadSync(path.join(PROTO_DIR, 'service-b.proto'));

const SERVICE_MAP: ServiceMap = {
  'servicea.ServiceA': {
    _root: rootA,
    // Legacy
    HealthCheck:      { fn: (r, m) => serviceA.healthCheck(r, m),      req: 'servicea.HealthCheckRequest',     res: 'servicea.HealthCheckResponse'  },
    GetAll:           { fn: (r, m) => serviceA.getAll(r, m),           req: 'servicea.GetAllRequest',          res: 'servicea.GetAllResponse'       },
    GetById:          { fn: (r, m) => serviceA.getById(r, m),          req: 'servicea.GetByIdRequest',         res: 'servicea.ItemResponse'         },
    Create:           { fn: (r, m) => serviceA.create(r, m),           req: 'servicea.CreateItemRequest',      res: 'servicea.ItemResponse'         },
    Update:           { fn: (r, m) => serviceA.update(r, m),           req: 'servicea.UpdateItemRequest',      res: 'servicea.ItemResponse'         },
    Delete:           { fn: (r, m) => serviceA.deleteItem(r, m),       req: 'servicea.DeleteItemRequest',      res: 'servicea.StatusResponse'       },
    Register:         { fn: (r, m) => serviceA.register(r, m),         req: 'servicea.RegisterRequest',        res: 'servicea.AuthResponse'         },
    Login:            { fn: (r, m) => serviceA.login(r, m),            req: 'servicea.LoginRequest',           res: 'servicea.AuthResponse'         },
    RefreshToken:     { fn: (r, m) => serviceA.refreshToken(r, m),     req: 'servicea.RefreshTokenRequest',    res: 'servicea.AuthResponse'         },
    Logout:           { fn: (r, m) => serviceA.logout(r, m),           req: 'servicea.RefreshTokenRequest',    res: 'servicea.StatusResponse'       },
    // Admin
    AdminLogin:       { fn: (r, m) => serviceA.adminLogin(r, m),       req: 'servicea.AdminLoginRequest',      res: 'servicea.AdminAuthResponse'    },
    // Product
    GetProducts:      { fn: (r, m) => serviceA.getProducts(r, m),      req: 'servicea.GetProductsRequest',     res: 'servicea.GetProductsResponse'  },
    GetProductById:   { fn: (r, m) => serviceA.getProductById(r, m),   req: 'servicea.GetByIdRequest',         res: 'servicea.ProductResponse'      },
    CreateProduct:    { fn: (r, m) => serviceA.createProduct(r, m),    req: 'servicea.CreateProductRequest',   res: 'servicea.ProductResponse'      },
    UpdateProduct:    { fn: (r, m) => serviceA.updateProduct(r, m),    req: 'servicea.UpdateProductRequest',   res: 'servicea.ProductResponse'      },
    DeleteProduct:    { fn: (r, m) => serviceA.deleteProduct(r, m),    req: 'servicea.DeleteItemRequest',      res: 'servicea.StatusResponse'       },
    ActivateProduct:  { fn: (r, m) => serviceA.activateProduct(r, m),  req: 'servicea.GetByIdRequest',         res: 'servicea.ProductResponse'      },
    DeactivateProduct:{ fn: (r, m) => serviceA.deactivateProduct(r, m),req: 'servicea.GetByIdRequest',         res: 'servicea.ProductResponse'      },
    // Order
    CreateOrder:      { fn: (r, m) => serviceA.createOrder(r, m),      req: 'servicea.CreateOrderRequest',     res: 'servicea.OrderResponse'        },
    GetOrderById:     { fn: (r, m) => serviceA.getOrderById(r, m),     req: 'servicea.GetByIdRequest',         res: 'servicea.OrderResponse'        },
    GetOrders:        { fn: (r, m) => serviceA.getOrders(r, m),        req: 'servicea.GetOrdersRequest',       res: 'servicea.GetOrdersResponse'    },
    GetUserOrders:    { fn: (r, m) => serviceA.getUserOrders(r, m),    req: 'servicea.GetUserOrdersRequest',   res: 'servicea.GetOrdersResponse'    },
    // Cart
    AddToCart:        { fn: (r, m) => serviceA.addToCart(r, m),        req: 'servicea.AddToCartRequest',       res: 'servicea.CartResponse'         },
    GetCart:          { fn: (r, m) => serviceA.getCart(r, m),          req: 'servicea.HealthCheckRequest',     res: 'servicea.CartResponse'         },
    UpdateCartItem:   { fn: (r, m) => serviceA.updateCartItem(r, m),   req: 'servicea.UpdateCartItemRequest',  res: 'servicea.CartResponse'         },
    RemoveFromCart:   { fn: (r, m) => serviceA.removeFromCart(r, m),   req: 'servicea.RemoveFromCartRequest',  res: 'servicea.CartResponse'         },
    ClearCart:        { fn: (r, m) => serviceA.clearCart(r, m),        req: 'servicea.HealthCheckRequest',     res: 'servicea.StatusResponse'       },
    CheckoutCart:     { fn: (r, m) => serviceA.checkoutCart(r, m),     req: 'servicea.HealthCheckRequest',     res: 'servicea.OrderResponse'        },
    // User management (admin)
    GetAllUsers:      { fn: (r, m) => serviceA.getAllUsers(r, m),       req: 'servicea.GetUsersRequest',        res: 'servicea.GetUsersResponse'     },
    // Order status (admin)
    UpdateOrderStatus:{ fn: (r, m) => serviceA.updateOrderStatus(r, m),req: 'servicea.UpdateOrderStatusRequest',res: 'servicea.OrderResponse'        },
  } as ServiceEntry,
  'serviceb.ServiceB': {
    _root: rootB,
    // Legacy
    HealthCheck:         { fn: (r, m) => serviceB.healthCheck(r, m),        req: 'serviceb.HealthCheckRequest',      res: 'serviceb.HealthCheckResponse'      },
    GetAll:              { fn: (r, m) => serviceB.getAll(r, m),              req: 'serviceb.GetAllRequest',           res: 'serviceb.GetAllResponse'           },
    GetById:             { fn: (r, m) => serviceB.getById(r, m),             req: 'serviceb.GetByIdRequest',          res: 'serviceb.RecordResponse'           },
    Create:              { fn: (r, m) => serviceB.create(r, m),              req: 'serviceb.CreateRecordRequest',     res: 'serviceb.RecordResponse'           },
    Update:              { fn: (r, m) => serviceB.update(r, m),              req: 'serviceb.UpdateRecordRequest',     res: 'serviceb.RecordResponse'           },
    Delete:              { fn: (r, m) => serviceB.deleteRecord(r, m),        req: 'serviceb.DeleteRecordRequest',     res: 'serviceb.StatusResponse'           },
    // Job
    GetJobs:             { fn: (r, m) => serviceB.getJobs(r, m),             req: 'serviceb.GetJobsRequest',          res: 'serviceb.GetJobsResponse'          },
    GetJobById:          { fn: (r, m) => serviceB.getJobById(r, m),          req: 'serviceb.GetByIdRequest',          res: 'serviceb.JobResponse'              },
    CreateJob:           { fn: (r, m) => serviceB.createJob(r, m),           req: 'serviceb.CreateJobRequest',        res: 'serviceb.JobResponse'              },
    UpdateJob:           { fn: (r, m) => serviceB.updateJob(r, m),           req: 'serviceb.UpdateJobRequest',        res: 'serviceb.JobResponse'              },
    DeleteJob:           { fn: (r, m) => serviceB.deleteJob(r, m),           req: 'serviceb.DeleteRecordRequest',     res: 'serviceb.StatusResponse'           },
    ActivateJob:         { fn: (r, m) => serviceB.activateJob(r, m),         req: 'serviceb.GetByIdRequest',          res: 'serviceb.JobResponse'              },
    DeactivateJob:       { fn: (r, m) => serviceB.deactivateJob(r, m),       req: 'serviceb.GetByIdRequest',          res: 'serviceb.JobResponse'              },
    // Application
    CreateApplication:   { fn: (r, m) => serviceB.createApplication(r, m),   req: 'serviceb.CreateApplicationRequest',res: 'serviceb.ApplicationResponse'      },
    GetApplicationById:  { fn: (r, m) => serviceB.getApplicationById(r, m),  req: 'serviceb.GetByIdRequest',          res: 'serviceb.ApplicationResponse'      },
    GetApplications:     { fn: (r, m) => serviceB.getApplications(r, m),     req: 'serviceb.GetApplicationsRequest',  res: 'serviceb.GetApplicationsResponse'  },
    GetUserApplications: { fn: (r, m) => serviceB.getUserApplications(r, m), req: 'serviceb.GetUserAppRequest',       res: 'serviceb.GetApplicationsResponse'  },
    GetJobApplications:       { fn: (r, m) => serviceB.getJobApplications(r, m),      req: 'serviceb.GetByIdRequest',                       res: 'serviceb.GetApplicationsResponse'  },
    UpdateApplicationStatus:  { fn: (r, m) => serviceB.updateApplicationStatus(r, m), req: 'serviceb.UpdateApplicationStatusRequest',        res: 'serviceb.ApplicationResponse'      },
    DeleteApplication:        { fn: (r, m) => serviceB.deleteApplication(r, m),       req: 'serviceb.GetByIdRequest',                       res: 'serviceb.StatusResponse'           },
  } as ServiceEntry,
};

// ── gRPC-Web frame helpers ────────────────────────────────────────────────────

const encodeDataFrame = (payload: Buffer): Buffer => {
  const frame = Buffer.allocUnsafe(5 + payload.length);
  frame[0] = 0x00;
  frame.writeUInt32BE(payload.length, 1);
  payload.copy(frame, 5);
  return frame;
};

const encodeTrailerFrame = (grpcStatus: number, grpcMessage = ''): Buffer => {
  const text = `grpc-status:${grpcStatus}\r\ngrpc-message:${encodeURIComponent(grpcMessage)}\r\n`;
  const buf   = Buffer.from(text, 'utf8');
  const frame = Buffer.allocUnsafe(5 + buf.length);
  frame[0] = 0x80;
  frame.writeUInt32BE(buf.length, 1);
  buf.copy(frame, 5);
  return frame;
};

const decodeRequestPayload = (body: unknown): Buffer => {
  if (!Buffer.isBuffer(body) || body.length < 5) return Buffer.alloc(0);
  const msgLen = body.readUInt32BE(1);
  return body.slice(5, 5 + msgLen);
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractClientIp(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim()
    ?? req.socket?.remoteAddress
    ?? req.ip
    ?? 'unknown'
  );
}

// ── Main handler ──────────────────────────────────────────────────────────────

export const handleGrpcWeb = async (req: Request, res: Response): Promise<void> => {
  const [serviceKey, method] = req.path.replace(/^\//, '').split('/');

  const svc = SERVICE_MAP[serviceKey];
  if (!svc || !(method in svc) || method === '_root') {
    res.status(404).type('text/plain').send(`grpc-web-proxy: unknown route ${serviceKey}/${method}`);
    return;
  }

  const route = svc[method] as { fn: (r: GrpcRequest, m?: GrpcMetadata) => Promise<Record<string, unknown>>; req: string; res: string };
  const protoRoot = svc['_root'] as protobuf.Root;

  const ReqType = protoRoot.lookupType(route.req);
  const ResType = protoRoot.lookupType(route.res);

  res.setHeader('Content-Type', 'application/grpc-web+proto');
  res.setHeader('Access-Control-Expose-Headers', 'grpc-status,grpc-message,content-type');

  // Correlation ID: honour the one from the frontend, or generate a new one
  const correlationId = (req.headers['x-correlation-id'] as string | undefined)
    || generateProxyId();

  const clientIp = extractClientIp(req);

  if (RATE_LIMITED_METHODS.has(method)) {
    const { allowed, retryAfterSec } = checkRateLimit(
      `${clientIp}:${method}`,
      config.rateLimit.windowMs,
      config.rateLimit.max,
    );
    if (!allowed) {
      res.send(encodeTrailerFrame(8, `Too many attempts. Try again in ${retryAfterSec}s.`));
      return;
    }
  }

  // Forward auth + correlation ID as gRPC metadata into service-a/b
  const authHeader = req.headers['authorization'] as string | undefined;
  const metadata: GrpcMetadata = { 'x-correlation-id': correlationId };
  if (authHeader) metadata['authorization'] = authHeader;

  const msgBytes = decodeRequestPayload(req.body);
  let requestObj: Record<string, unknown>;
  try {
    const decoded = ReqType.decode(msgBytes);
    requestObj = ReqType.toObject(decoded, { longs: Number, enums: String, defaults: true }) as Record<string, unknown>;
  } catch {
    logDecodeError(`${serviceKey}/${method}`);
    res.send(encodeTrailerFrame(3, 'Invalid request encoding'));
    return;
  }

  const url     = `http://${req.headers['host'] ?? 'localhost'}${req.path}`;
  const startMs = Date.now();

  logRequest({
    correlationId,
    clientIp,
    service:    serviceKey,
    rpcMethod:  method,
    httpMethod: req.method,
    url,
    headers: req.headers as Record<string, string | string[] | undefined>,
    payload: requestObj,
  });

  try {
    const grpcResult = await route.fn(requestObj, metadata);
    const elapsed    = Date.now() - startMs;

    logResponse({
      correlationId,
      service:   serviceKey,
      rpcMethod: method,
      duration:  elapsed,
      body:      grpcResult,
    });

    const resMsg   = ResType.fromObject(grpcResult);
    const resBytes = Buffer.from(ResType.encode(resMsg).finish());
    res.send(Buffer.concat([encodeDataFrame(resBytes), encodeTrailerFrame(0)]));
  } catch (err: unknown) {
    const elapsed  = Date.now() - startMs;
    const grpcErr  = err as { code?: number; details?: string; message?: string; stack?: string };
    const status   = grpcErr.code    ?? 13;
    const message  = grpcErr.details ?? grpcErr.message ?? 'Internal server error';

    logError({
      correlationId,
      service:   serviceKey,
      rpcMethod: method,
      duration:  elapsed,
      code:      status,
      message,
      stack:     grpcErr.stack,
    });

    res.send(encodeTrailerFrame(status, message));
  }
};
