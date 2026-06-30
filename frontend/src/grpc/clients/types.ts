import type { PaginationMeta, HealthCheckResponse, StatusResponse } from '../types';

// ── Service A — Product domain ───────────────────────────────────────────────

export interface Product {
  id:          string;
  name:        string;
  description: string;
  category:    string;
  image:       string;
  price:       number;
  stock:       number;
  status:      string;
  createdAt:   string;
  updatedAt:   string;
}

export interface GetProductsParams {
  page?:     number;
  limit?:    number;
  status?:   string;
  category?: string;
  search?:   string;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  data:    Product[];
  meta:    PaginationMeta;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data:    Product;
}

// ── Service A — Order domain ─────────────────────────────────────────────────

export interface OrderProduct {
  productId:   string;
  productName: string;
  quantity:    number;
  price:       number;
}

export interface Order {
  id:            string;
  userId:        string;
  products:      OrderProduct[];
  totalAmount:   number;
  orderStatus:   string;
  paymentStatus: string;
  createdAt:     string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data:    Order;
}

export interface GetOrdersParams {
  page?:        number;
  limit?:       number;
  orderStatus?: string;
}

export interface GetUserOrdersParams {
  userId?: string;
  page?:   number;
  limit?:  number;
}

export interface OrderListResponse {
  success: boolean;
  message: string;
  data:    Order[];
  meta:    PaginationMeta;
}

// ── Service A — Cart domain ──────────────────────────────────────────────────

export interface CartItem {
  productId:   string;
  productName: string;
  quantity:    number;
  price:       number;
}

export interface Cart {
  id:          string;
  userId:      string;
  items:       CartItem[];
  totalAmount: number;
  updatedAt:   string;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data:    Cart;
}

export interface AddToCartRequest {
  productId: string;
  quantity:  number;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity:  number;
}

// ── Service A — Item domain ──────────────────────────────────────────────────

export interface Item {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllItemsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

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

export interface CreateItemRequest {
  name: string;
  description: string;
  status: string;
}

export interface UpdateItemRequest {
  id: string;
  name: string;
  description: string;
  status: string;
}

export interface AuthUser {
  id:        string;
  name:      string;
  email:     string;
  role:      string;
  createdAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

export interface CreateProductRequest {
  name:        string;
  description: string;
  category:    string;
  image:       string;
  price:       number;
  stock:       number;
  status:      string;
}

export interface UpdateProductRequest {
  id:          string;
  name:        string;
  description: string;
  category:    string;
  image:       string;
  price:       number;
  stock:       number;
  status:      string;
}

export interface UserData {
  id:        string;
  name:      string;
  email:     string;
  role:      string;
  createdAt: string;
}

export interface GetUsersParams {
  page?:  number;
  limit?: number;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data:    UserData[];
  meta:    PaginationMeta;
}

export interface UpdateOrderStatusRequest {
  id:          string;
  orderStatus: string;
}

export interface IServiceAClient {
  healthCheck:    () => Promise<HealthCheckResponse>;
  getAll:         (params: GetAllItemsParams) => Promise<ItemListResponse>;
  getById:        (id: string) => Promise<ItemResponse>;
  create:         (body: CreateItemRequest) => Promise<ItemResponse>;
  update:         (body: UpdateItemRequest) => Promise<ItemResponse>;
  deleteItem:     (id: string) => Promise<StatusResponse>;
  register:       (body: RegisterRequest) => Promise<AuthResponse>;
  login:          (body: LoginRequest) => Promise<AuthResponse>;
  // Products
  getProducts:    (params: GetProductsParams) => Promise<ProductListResponse>;
  createProduct:     (body: CreateProductRequest) => Promise<ProductResponse>;
  updateProduct:     (body: UpdateProductRequest) => Promise<ProductResponse>;
  deleteProduct:     (id: string) => Promise<StatusResponse>;
  activateProduct:   (id: string) => Promise<ProductResponse>;
  deactivateProduct: (id: string) => Promise<ProductResponse>;
  // Orders
  createOrder:       (body: { productId: string; quantity: number }) => Promise<OrderResponse>;
  getOrders:         (params: GetOrdersParams) => Promise<OrderListResponse>;
  getUserOrders:     (params: GetUserOrdersParams) => Promise<OrderListResponse>;
  updateOrderStatus: (body: UpdateOrderStatusRequest) => Promise<OrderResponse>;
  // Cart
  addToCart:      (body: AddToCartRequest) => Promise<CartResponse>;
  getCart:        () => Promise<CartResponse>;
  updateCartItem: (body: UpdateCartItemRequest) => Promise<CartResponse>;
  removeFromCart: (productId: string) => Promise<CartResponse>;
  clearCart:      () => Promise<StatusResponse>;
  checkoutCart:   () => Promise<OrderResponse>;
  // Admin: user management
  getAllUsers:     (params: GetUsersParams) => Promise<UserListResponse>;
}

// ── Service B — Job domain ───────────────────────────────────────────────────

export interface Job {
  id:                 string;
  title:              string;
  description:        string;
  department:         string;
  location:           string;
  experienceRequired: string;
  salaryRange:        string;
  status:             string;
  createdAt:          string;
  updatedAt:          string;
}

export interface GetJobsParams {
  page?:       number;
  limit?:      number;
  status?:     string;
  department?: string;
  search?:     string;
}

export interface CreateJobRequest {
  title:              string;
  description:        string;
  department:         string;
  location:           string;
  experienceRequired: string;
  salaryRange:        string;
  status:             string;
}

export interface UpdateJobRequest {
  id:                 string;
  title:              string;
  description:        string;
  department:         string;
  location:           string;
  experienceRequired: string;
  salaryRange:        string;
  status:             string;
}

export interface JobResponse {
  success: boolean;
  message: string;
  data:    Job;
}

export interface JobListResponse {
  success: boolean;
  message: string;
  data:    Job[];
  meta:    import('../types').PaginationMeta;
}

// ── Service B — Application domain ───────────────────────────────────────────

export interface Application {
  id:                string;
  userId:            string;
  jobId:             string;
  resumeUrl:         string;
  coverLetter:       string;
  applicationStatus: string;
  createdAt:         string;
}

export interface CreateApplicationRequest {
  userId:      string;
  jobId:       string;
  resumeUrl:   string;
  coverLetter: string;
}

export interface GetApplicationsParams {
  page?:              number;
  limit?:             number;
  applicationStatus?: string;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data:    Application;
}

export interface ApplicationListResponse {
  success: boolean;
  message: string;
  data:    Application[];
  meta:    import('../types').PaginationMeta;
}

// ── Service B — Record domain ────────────────────────────────────────────────

export interface ServiceRecord {
  id: string;
  title: string;
  content: string;
  status: string;
  refId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllRecordsParams {
  page?: number;
  limit?: number;
  status?: string;
  refId?: string;
}

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

export interface CreateRecordRequest {
  title: string;
  content: string;
  status: string;
  refId: string;
}

export interface UpdateRecordRequest {
  id: string;
  title: string;
  content: string;
  status: string;
}

export interface UpdateApplicationStatusRequest {
  id:                string;
  applicationStatus: string;
}

export interface IServiceBClient {
  healthCheck:  () => Promise<HealthCheckResponse>;
  getAll:       (params: GetAllRecordsParams) => Promise<RecordListResponse>;
  getById:      (id: string) => Promise<RecordResponse>;
  create:       (body: CreateRecordRequest) => Promise<RecordResponse>;
  update:       (body: UpdateRecordRequest) => Promise<RecordResponse>;
  deleteRecord: (id: string) => Promise<StatusResponse>;
  // Jobs
  getJobs:        (params: GetJobsParams)    => Promise<JobListResponse>;
  getJobById:     (id: string)               => Promise<JobResponse>;
  createJob:      (body: CreateJobRequest)   => Promise<JobResponse>;
  updateJob:      (body: UpdateJobRequest)   => Promise<JobResponse>;
  deleteJob:      (id: string)               => Promise<StatusResponse>;
  activateJob:    (id: string)               => Promise<JobResponse>;
  deactivateJob:  (id: string)               => Promise<JobResponse>;
  // Applications
  createApplication:   (body: CreateApplicationRequest) => Promise<ApplicationResponse>;
  getApplicationById:  (id: string)                     => Promise<ApplicationResponse>;
  getApplications:     (params: GetApplicationsParams)  => Promise<ApplicationListResponse>;
  getUserApplications:     (userId: string)                              => Promise<ApplicationListResponse>;
  getJobApplications:      (jobId: string)                               => Promise<ApplicationListResponse>;
  updateApplicationStatus: (body: UpdateApplicationStatusRequest)        => Promise<ApplicationResponse>;
  deleteApplication:       (id: string)                                  => Promise<StatusResponse>;
}
