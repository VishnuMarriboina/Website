import * as grpc from '@grpc/grpc-js';

export type UnaryCall<Req = Record<string, unknown>> =
  grpc.ServerUnaryCall<Req, Record<string, unknown>>;

export type UnaryCb<Res = Record<string, unknown>> =
  grpc.sendUnaryData<Res>;

export interface GrpcError {
  code:    number;
  details: string;
}

// ── Request / response shapes (match proto definitions) ──────────────────────

export interface HealthCheckReq {}
export interface HealthCheckRes {
  status:    string;
  service:   string;
  timestamp: string;
}

export interface GetByIdReq    { id: string }
export interface GetAllReq     { page: number; limit: number; status: string; search: string }
export interface CreateItemReq { name: string; description: string; status: string }
export interface UpdateItemReq { id: string; name: string; description: string; status: string }
export interface DeleteItemReq { id: string }

export interface RegisterReq   { name: string; email: string; password: string }
export interface LoginReq      { email: string; password: string }

// ── Admin ──────────────────────────────────────────────────────────────────────
export interface AdminLoginReq { email: string; password: string }

// ── Product ───────────────────────────────────────────────────────────────────
export interface GetProductsReq  { page: number; limit: number; status: string; category: string; search: string }
export interface CreateProductReq { name: string; description: string; category: string; image: string; price: number; stock: number; status: string }
export interface UpdateProductReq { id: string; name: string; description: string; category: string; image: string; price: number; stock: number; status: string }
export interface DeleteProductReq { id: string }

// ── Order ─────────────────────────────────────────────────────────────────────
export interface CreateOrderReq   { userId: string; productId: string; quantity: number }
export interface GetOrdersReq     { page: number; limit: number; orderStatus: string }
export interface GetUserOrdersReq { userId: string; page: number; limit: number }

// ── Cart ──────────────────────────────────────────────────────────────────────
export interface AddToCartReq        { productId: string; quantity: number }
export interface UpdateCartItemReq   { productId: string; quantity: number }
export interface RemoveFromCartReq   { productId: string }

// ── User management (admin) ────────────────────────────────────────────────────
export interface GetUsersReq { page: number; limit: number }

// ── Order status update (admin) ───────────────────────────────────────────────
export interface UpdateOrderStatusReq { id: string; orderStatus: string }
