import protobuf from 'protobufjs/light';
import { SERVICE_A_DESCRIPTOR } from '../proto/serviceA';
import { grpcWebCall } from '../transport';
import type {
  IServiceAClient,
  GetAllItemsParams,
  CreateItemRequest,
  UpdateItemRequest,
  AuthResponse,
  ItemListResponse,
  ItemResponse,
  GetProductsParams,
  ProductListResponse,
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
  GetOrdersParams,
  GetUserOrdersParams,
  OrderListResponse,
  OrderResponse,
  UpdateOrderStatusRequest,
  AddToCartRequest,
  UpdateCartItemRequest,
  CartResponse,
  GetUsersParams,
  UserListResponse,
} from './types';
import type { HealthCheckResponse, StatusResponse } from '../types';

const root = protobuf.Root.fromJSON(SERVICE_A_DESCRIPTOR as protobuf.INamespace).resolveAll();
const t = (name: string): protobuf.Type => root.lookupType(`servicea.${name}`);

const SERVICE = 'servicea.ServiceA';

const serviceAClient: IServiceAClient = {
  // Legacy items
  healthCheck:    ()     => grpcWebCall<HealthCheckResponse>(SERVICE, 'HealthCheck',    t('HealthCheckRequest'),    t('HealthCheckResponse'),  {}),
  getAll:         (p: GetAllItemsParams)   => grpcWebCall<ItemListResponse>  (SERVICE, 'GetAll',         t('GetAllRequest'),         t('GetAllResponse'),       p),
  getById:        (id)   => grpcWebCall<ItemResponse>       (SERVICE, 'GetById',        t('GetByIdRequest'),        t('ItemResponse'),         { id }),
  create:         (body: CreateItemRequest) => grpcWebCall<ItemResponse>    (SERVICE, 'Create',         t('CreateItemRequest'),     t('ItemResponse'),         body),
  update:         (body: UpdateItemRequest) => grpcWebCall<ItemResponse>    (SERVICE, 'Update',         t('UpdateItemRequest'),     t('ItemResponse'),         body),
  deleteItem:     (id)   => grpcWebCall<StatusResponse>     (SERVICE, 'Delete',         t('DeleteItemRequest'),     t('StatusResponse'),       { id }),
  register:       (body) => grpcWebCall<AuthResponse>       (SERVICE, 'Register',       t('RegisterRequest'),       t('AuthResponse'),         body),
  login:          (body) => grpcWebCall<AuthResponse>       (SERVICE, 'Login',          t('LoginRequest'),          t('AuthResponse'),         body),
  // Products
  getProducts:       (p: GetProductsParams)    => grpcWebCall<ProductListResponse>(SERVICE, 'GetProducts',       t('GetProductsRequest'),       t('GetProductsResponse'),  p),
  createProduct:     (body: CreateProductRequest) => grpcWebCall<ProductResponse>(SERVICE, 'CreateProduct',    t('CreateProductRequest'),     t('ProductResponse'),  body),
  updateProduct:     (body: UpdateProductRequest) => grpcWebCall<ProductResponse>(SERVICE, 'UpdateProduct',    t('UpdateProductRequest'),     t('ProductResponse'),  body),
  deleteProduct:     (id)                      => grpcWebCall<StatusResponse>  (SERVICE, 'DeleteProduct',       t('DeleteItemRequest'),        t('StatusResponse'),   { id }),
  activateProduct:   (id)                      => grpcWebCall<ProductResponse> (SERVICE, 'ActivateProduct',    t('GetByIdRequest'),           t('ProductResponse'),  { id }),
  deactivateProduct: (id)                      => grpcWebCall<ProductResponse> (SERVICE, 'DeactivateProduct',  t('GetByIdRequest'),           t('ProductResponse'),  { id }),
  // Orders
  createOrder:       (body) => grpcWebCall<OrderResponse>    (SERVICE, 'CreateOrder',       t('CreateOrderRequest'),       t('OrderResponse'),        body),
  getOrders:         (p: GetOrdersParams)      => grpcWebCall<OrderListResponse> (SERVICE, 'GetOrders',         t('GetOrdersRequest'),         t('GetOrdersResponse'),    p),
  getUserOrders:     (p: GetUserOrdersParams)  => grpcWebCall<OrderListResponse> (SERVICE, 'GetUserOrders',     t('GetUserOrdersRequest'),     t('GetOrdersResponse'),    p),
  updateOrderStatus: (body: UpdateOrderStatusRequest) => grpcWebCall<OrderResponse>(SERVICE, 'UpdateOrderStatus', t('UpdateOrderStatusRequest'), t('OrderResponse'),      body),
  // Cart
  addToCart:      (body: AddToCartRequest)      => grpcWebCall<CartResponse>  (SERVICE, 'AddToCart',      t('AddToCartRequest'),      t('CartResponse'),         body),
  getCart:        ()                            => grpcWebCall<CartResponse>  (SERVICE, 'GetCart',        t('HealthCheckRequest'),    t('CartResponse'),         {}),
  updateCartItem: (body: UpdateCartItemRequest) => grpcWebCall<CartResponse>  (SERVICE, 'UpdateCartItem', t('UpdateCartItemRequest'), t('CartResponse'),         body),
  removeFromCart: (productId)                   => grpcWebCall<CartResponse>  (SERVICE, 'RemoveFromCart', t('RemoveFromCartRequest'), t('CartResponse'),         { productId }),
  clearCart:      ()                            => grpcWebCall<StatusResponse>(SERVICE, 'ClearCart',      t('HealthCheckRequest'),    t('StatusResponse'),       {}),
  checkoutCart:   ()                            => grpcWebCall<OrderResponse> (SERVICE, 'CheckoutCart',   t('HealthCheckRequest'),    t('OrderResponse'),        {}),
  // Admin: user management
  getAllUsers:     (p: GetUsersParams)          => grpcWebCall<UserListResponse>  (SERVICE, 'GetAllUsers',     t('GetUsersRequest'),          t('GetUsersResponse'),     p),
};

export default serviceAClient;
