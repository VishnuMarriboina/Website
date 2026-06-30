export interface GrpcRequest {
  [key: string]: unknown;
}

export interface GrpcResponse {
  [key: string]: unknown;
}

export type GrpcMetadata = Record<string, string>;

export interface ServiceAClient {
  // Legacy
  healthCheck:      (r?: GrpcRequest, m?: GrpcMetadata) => Promise<GrpcResponse>;
  getById:          (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  getAll:           (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  create:           (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  update:           (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  deleteItem:       (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  register:         (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  login:            (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  // Admin
  adminLogin:       (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  // Product
  getProducts:      (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  getProductById:   (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  createProduct:    (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  updateProduct:    (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  deleteProduct:    (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  activateProduct:  (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  deactivateProduct:(r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  // Order
  createOrder:      (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  getOrderById:     (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  getOrders:        (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  getUserOrders:    (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  // Cart
  addToCart:        (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  getCart:          (r?: GrpcRequest, m?: GrpcMetadata) => Promise<GrpcResponse>;
  updateCartItem:   (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  removeFromCart:   (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  clearCart:        (r?: GrpcRequest, m?: GrpcMetadata) => Promise<GrpcResponse>;
  checkoutCart:     (r?: GrpcRequest, m?: GrpcMetadata) => Promise<GrpcResponse>;
  // User management (admin)
  getAllUsers:       (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  // Order status (admin)
  updateOrderStatus:(r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
}

export interface ServiceBClient {
  // Legacy
  healthCheck:         (r?: GrpcRequest, m?: GrpcMetadata) => Promise<GrpcResponse>;
  getById:             (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  getAll:              (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  create:              (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  update:              (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  deleteRecord:        (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  // Job
  getJobs:             (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  getJobById:          (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  createJob:           (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  updateJob:           (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  deleteJob:           (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  activateJob:         (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  deactivateJob:       (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  // Application
  createApplication:   (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  getApplicationById:  (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  getApplications:     (r: GrpcRequest,  m?: GrpcMetadata) => Promise<GrpcResponse>;
  getUserApplications:      (r: GrpcRequest, m?: GrpcMetadata) => Promise<GrpcResponse>;
  getJobApplications:       (r: GrpcRequest, m?: GrpcMetadata) => Promise<GrpcResponse>;
  updateApplicationStatus:  (r: GrpcRequest, m?: GrpcMetadata) => Promise<GrpcResponse>;
  deleteApplication:        (r: GrpcRequest, m?: GrpcMetadata) => Promise<GrpcResponse>;
}
