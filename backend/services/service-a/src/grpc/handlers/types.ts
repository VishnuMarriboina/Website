import * as grpc from '@grpc/grpc-js';
import * as ServiceA from '../../generated/service-a';

export type UnaryCall<Req = Record<string, unknown>> =
  grpc.ServerUnaryCall<Req, Record<string, unknown>>;

export type UnaryCb<Res = Record<string, unknown>> =
  grpc.sendUnaryData<Res>;

export interface GrpcError {
  code:    number;
  details: string;
}

// ── Request / response shapes — sourced from the generated proto types so
//    they can't drift from backend/proto/service-a.proto. Names are kept
//    as-is so handler files don't need to change their imports. ────────────

export type HealthCheckReq = ServiceA.HealthCheckRequest;
export type HealthCheckRes = ServiceA.HealthCheckResponse;

export type GetByIdReq    = ServiceA.GetByIdRequest;
export type GetAllReq     = ServiceA.GetAllRequest;
export type CreateItemReq = ServiceA.CreateItemRequest;
export type UpdateItemReq = ServiceA.UpdateItemRequest;
export type DeleteItemReq = ServiceA.DeleteItemRequest;

export type RegisterReq     = ServiceA.RegisterRequest;
export type LoginReq        = ServiceA.LoginRequest;
export type RefreshTokenReq = ServiceA.RefreshTokenRequest;
export type LogoutReq       = ServiceA.RefreshTokenRequest;

// ── Admin ──────────────────────────────────────────────────────────────────────
export type AdminLoginReq = ServiceA.AdminLoginRequest;

// ── Product ───────────────────────────────────────────────────────────────────
export type GetProductsReq   = ServiceA.GetProductsRequest;
export type CreateProductReq = ServiceA.CreateProductRequest;
export type UpdateProductReq = ServiceA.UpdateProductRequest;
// DeleteProduct rpc reuses DeleteItemRequest on the wire (see service-a.proto).
export type DeleteProductReq = ServiceA.DeleteItemRequest;

// ── Order ─────────────────────────────────────────────────────────────────────
export type CreateOrderReq   = ServiceA.CreateOrderRequest;
export type GetOrdersReq     = ServiceA.GetOrdersRequest;
export type GetUserOrdersReq = ServiceA.GetUserOrdersRequest;

// ── Cart ──────────────────────────────────────────────────────────────────────
export type AddToCartReq      = ServiceA.AddToCartRequest;
export type UpdateCartItemReq = ServiceA.UpdateCartItemRequest;
export type RemoveFromCartReq = ServiceA.RemoveFromCartRequest;

// ── User management (admin) ────────────────────────────────────────────────────
export type GetUsersReq = ServiceA.GetUsersRequest;

// ── Order status update (admin) ───────────────────────────────────────────────
export type UpdateOrderStatusReq = ServiceA.UpdateOrderStatusRequest;
