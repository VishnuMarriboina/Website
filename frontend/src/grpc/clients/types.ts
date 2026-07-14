import type {
  PaginationMeta,
  HealthCheckResponse,
  StatusResponse,
} from "../types";
import type * as ServiceA from "../generated/service-a";
import type * as ServiceB from "../generated/service-b";

// ── Service A — Product domain ───────────────────────────────────────────────

export type Product = ServiceA.Product;

export type GetProductsParams = Partial<ServiceA.GetProductsRequest>;

export interface ProductListResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: PaginationMeta;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

// ── Service A — Order domain ─────────────────────────────────────────────────

export type OrderProduct = ServiceA.OrderProduct;

export type Order = ServiceA.Order;

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export type GetOrdersParams = Partial<ServiceA.GetOrdersRequest>;

export type GetUserOrdersParams = Partial<ServiceA.GetUserOrdersRequest>;

export interface OrderListResponse {
  success: boolean;
  message: string;
  data: Order[];
  meta: PaginationMeta;
}

// ── Service A — Cart domain ──────────────────────────────────────────────────

export type CartItem = ServiceA.CartItem;

export type Cart = ServiceA.Cart;

export interface CartResponse {
  success: boolean;
  message: string;
  data: Cart;
}

export type AddToCartRequest = ServiceA.AddToCartRequest;

export type UpdateCartItemRequest = ServiceA.UpdateCartItemRequest;

// ── Service A — Item domain ──────────────────────────────────────────────────

export type Item = ServiceA.Item;

export type GetAllItemsParams = Partial<ServiceA.GetAllRequest>;

export interface ItemListResponse {
  success: boolean;
  message: string;
  data: Item[];
  meta: PaginationMeta;
}

export interface ItemResponse {
  success: boolean;
  message: string;
  data: Item;
}

export type CreateItemRequest = ServiceA.CreateItemRequest;

export type UpdateItemRequest = ServiceA.UpdateItemRequest;

export type AuthUser = ServiceA.AuthUser;

export type RegisterRequest = ServiceA.RegisterRequest;

export type LoginRequest = ServiceA.LoginRequest;

export type RefreshTokenRequest = ServiceA.RefreshTokenRequest;

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
  refreshToken: string;
}

export type CreateProductRequest = ServiceA.CreateProductRequest;

export type UpdateProductRequest = ServiceA.UpdateProductRequest;

export type UserData = ServiceA.UserData;

export type GetUsersParams = Partial<ServiceA.GetUsersRequest>;

export interface UserListResponse {
  success: boolean;
  message: string;
  data: UserData[];
  meta: PaginationMeta;
}

export type UpdateOrderStatusRequest = ServiceA.UpdateOrderStatusRequest;

export interface IServiceAClient {
  healthCheck: () => Promise<HealthCheckResponse>;
  getAll: (params: GetAllItemsParams) => Promise<ItemListResponse>;
  getById: (id: string) => Promise<ItemResponse>;
  create: (body: CreateItemRequest) => Promise<ItemResponse>;
  update: (body: UpdateItemRequest) => Promise<ItemResponse>;
  deleteItem: (id: string) => Promise<StatusResponse>;
  register: (body: RegisterRequest) => Promise<AuthResponse>;
  login: (body: LoginRequest) => Promise<AuthResponse>;
  refreshToken: (body: RefreshTokenRequest) => Promise<AuthResponse>;
  logout: (body: RefreshTokenRequest) => Promise<StatusResponse>;
  // Products
  getProducts: (params: GetProductsParams) => Promise<ProductListResponse>;
  createProduct: (body: CreateProductRequest) => Promise<ProductResponse>;
  updateProduct: (body: UpdateProductRequest) => Promise<ProductResponse>;
  deleteProduct: (id: string) => Promise<StatusResponse>;
  activateProduct: (id: string) => Promise<ProductResponse>;
  deactivateProduct: (id: string) => Promise<ProductResponse>;
  // Orders
  createOrder: (body: {
    productId: string;
    quantity: number;
  }) => Promise<OrderResponse>;
  getOrders: (params: GetOrdersParams) => Promise<OrderListResponse>;
  getUserOrders: (params: GetUserOrdersParams) => Promise<OrderListResponse>;
  updateOrderStatus: (body: UpdateOrderStatusRequest) => Promise<OrderResponse>;
  // Cart
  addToCart: (body: AddToCartRequest) => Promise<CartResponse>;
  getCart: () => Promise<CartResponse>;
  updateCartItem: (body: UpdateCartItemRequest) => Promise<CartResponse>;
  removeFromCart: (productId: string) => Promise<CartResponse>;
  clearCart: () => Promise<StatusResponse>;
  checkoutCart: () => Promise<OrderResponse>;
  // Admin: user management
  getAllUsers: (params: GetUsersParams) => Promise<UserListResponse>;
}

// ── Service B — Job domain ───────────────────────────────────────────────────

export type Job = ServiceB.Job;

export type GetJobsParams = Partial<ServiceB.GetJobsRequest>;

export type CreateJobRequest = ServiceB.CreateJobRequest;

export type UpdateJobRequest = ServiceB.UpdateJobRequest;

export interface JobResponse {
  success: boolean;
  message: string;
  data: Job;
}

export interface JobListResponse {
  success: boolean;
  message: string;
  data: Job[];
  meta: PaginationMeta;
}

// ── Service B — Application domain ───────────────────────────────────────────

export type Application = ServiceB.Application;

export type CreateApplicationRequest = ServiceB.CreateApplicationRequest;

export type GetApplicationsParams = Partial<ServiceB.GetApplicationsRequest>;

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data: Application;
}

export interface ApplicationListResponse {
  success: boolean;
  message: string;
  data: Application[];
  meta: PaginationMeta;
}

// ── Service B — Record domain ────────────────────────────────────────────────

export type ServiceRecord = ServiceB.Record;

export type GetAllRecordsParams = Partial<ServiceB.GetAllRequest>;

export interface RecordListResponse {
  success: boolean;
  message: string;
  data: ServiceRecord[];
  meta: PaginationMeta;
}

export interface RecordResponse {
  success: boolean;
  message: string;
  data: ServiceRecord;
}

export type CreateRecordRequest = ServiceB.CreateRecordRequest;

export type UpdateRecordRequest = ServiceB.UpdateRecordRequest;

export type UpdateApplicationStatusRequest = ServiceB.UpdateApplicationStatusRequest;

export interface IServiceBClient {
  healthCheck: () => Promise<HealthCheckResponse>;
  getAll: (params: GetAllRecordsParams) => Promise<RecordListResponse>;
  getById: (id: string) => Promise<RecordResponse>;
  create: (body: CreateRecordRequest) => Promise<RecordResponse>;
  update: (body: UpdateRecordRequest) => Promise<RecordResponse>;
  deleteRecord: (id: string) => Promise<StatusResponse>;
  // Jobs
  getJobs: (params: GetJobsParams) => Promise<JobListResponse>;
  getJobById: (id: string) => Promise<JobResponse>;
  createJob: (body: CreateJobRequest) => Promise<JobResponse>;
  updateJob: (body: UpdateJobRequest) => Promise<JobResponse>;
  deleteJob: (id: string) => Promise<StatusResponse>;
  activateJob: (id: string) => Promise<JobResponse>;
  deactivateJob: (id: string) => Promise<JobResponse>;
  // Applications
  createApplication: (
    body: CreateApplicationRequest,
  ) => Promise<ApplicationResponse>;
  getApplicationById: (id: string) => Promise<ApplicationResponse>;
  getApplications: (
    params: GetApplicationsParams,
  ) => Promise<ApplicationListResponse>;
  getUserApplications: (userId: string) => Promise<ApplicationListResponse>;
  getJobApplications: (jobId: string) => Promise<ApplicationListResponse>;
  updateApplicationStatus: (
    body: UpdateApplicationStatusRequest,
  ) => Promise<ApplicationResponse>;
  deleteApplication: (id: string) => Promise<StatusResponse>;
}
