import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import serviceAClient from '../grpc/clients/serviceAClient';
import { useAuthStore } from '../store/authStore';
import type {
  GetAllItemsParams,
  CreateItemRequest,
  UpdateItemRequest,
  GetProductsParams,
  CreateProductRequest,
  UpdateProductRequest,
  GetOrdersParams,
  GetUserOrdersParams,
  UpdateOrderStatusRequest,
  AddToCartRequest,
  UpdateCartItemRequest,
  GetUsersParams,
} from '../grpc/clients/types';

// ── Query keys ────────────────────────────────────────────────────────────────

export const serviceAKeys = {
  health:      ['servicea', 'health']                                        as const,
  items:       ['servicea', 'items']                                         as const,
  itemList:    (p?: GetAllItemsParams)  => ['servicea', 'items', 'list', p ?? {}]  as const,
  itemDetail:  (id: string)             => ['servicea', 'items', id]               as const,
  products:    ['servicea', 'products']                                      as const,
  productList: (p?: GetProductsParams)  => ['servicea', 'products', 'list', p ?? {}] as const,
  orders:      ['servicea', 'orders']                                        as const,
  allOrders:   ['servicea', 'orders', 'all']                                 as const,
  userOrders:  (p?: GetUserOrdersParams) => ['servicea', 'orders', 'user', p ?? {}]  as const,
  cart:        ['servicea', 'cart']                                          as const,
  users:       ['servicea', 'users']                                         as const,
  allUsers:    ['servicea', 'users', 'all']                                  as const,
} as const;

// ── Queries ───────────────────────────────────────────────────────────────────

export function useServiceAHealth() {
  return useQuery({
    queryKey:       serviceAKeys.health,
    queryFn:        () => serviceAClient.healthCheck(),
    staleTime:      30_000,
    refetchInterval: 30_000,
  });
}

export function useItems(params?: GetAllItemsParams) {
  return useQuery({
    queryKey: serviceAKeys.itemList(params),
    queryFn:  () => serviceAClient.getAll(params ?? {}),
    staleTime: 60_000,
    gcTime:    5 * 60_000,
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: serviceAKeys.itemDetail(id),
    queryFn:  () => serviceAClient.getById(id),
    enabled:  !!id,
    staleTime: 60_000,
    gcTime:    5 * 60_000,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateItem() {
  const qc = useQueryClient();  //useQueryClient give access to the React Query Cache. It is similar like useDispatch()
  return useMutation({
    mutationFn: (body: CreateItemRequest) => serviceAClient.create(body),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceAKeys.items }),
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateItemRequest) => serviceAClient.update(body),
    onSuccess:  (_, vars) => {
      qc.invalidateQueries({ queryKey: serviceAKeys.itemDetail(vars.id) });
      qc.invalidateQueries({ queryKey: serviceAKeys.items });
    },
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceAClient.deleteItem(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceAKeys.items }),
  });
}

// ── Auth mutations ────────────────────────────────────────────────────────────

export function useLogin() {
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      serviceAClient.login(body),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (body: { name: string; email: string; password: string }) =>
      serviceAClient.register(body),
  });
}

// Clears local session state immediately, then best-effort revokes the
// refresh token server-side (a failed revoke call shouldn't block logout —
// the token will simply expire on its own).
export function useLogout() {
  const clearAuth = useAuthStore((s) => s.logout);

  return () => {
    const { refreshToken } = useAuthStore.getState();
    clearAuth();
    if (refreshToken) {
      serviceAClient.logout({ refreshToken }).catch(() => {});
    }
  };
}

// ── Product queries ───────────────────────────────────────────────────────────

export function useProducts(params?: GetProductsParams) {
  return useQuery({
    queryKey: serviceAKeys.productList(params),
    queryFn:  () => serviceAClient.getProducts(params ?? {}),
    staleTime: 60_000,
    gcTime:    5 * 60_000,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProductRequest) => serviceAClient.createProduct(body),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceAKeys.products }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateProductRequest) => serviceAClient.updateProduct(body),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceAKeys.products }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceAClient.deleteProduct(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceAKeys.products }),
  });
}

export function useActivateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceAClient.activateProduct(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceAKeys.products }),
  });
}

export function useDeactivateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceAClient.deactivateProduct(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceAKeys.products }),
  });
}

// ── Order queries / mutations ─────────────────────────────────────────────────

export function useAllOrders(params?: GetOrdersParams) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: serviceAKeys.allOrders,
    queryFn:  () => serviceAClient.getOrders(params ?? {}),
    enabled:  !!token,
    staleTime: 30_000,
    gcTime:    5 * 60_000,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateOrderStatusRequest) => serviceAClient.updateOrderStatus(body),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: serviceAKeys.orders });
      qc.invalidateQueries({ queryKey: serviceAKeys.allOrders });
    },
  });
}

export function useAllUsers(params?: GetUsersParams) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: serviceAKeys.allUsers,
    queryFn:  () => serviceAClient.getAllUsers(params ?? {}),
    enabled:  !!token,
    staleTime: 60_000,
    gcTime:    5 * 60_000,
  });
}

export function useUserOrders(params?: GetUserOrdersParams) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: serviceAKeys.userOrders(params),
    queryFn:  () => serviceAClient.getUserOrders(params ?? {}),
    enabled:  !!token,
    staleTime: 30_000,
    gcTime:    5 * 60_000,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { productId: string; quantity: number }) =>
      serviceAClient.createOrder(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceAKeys.orders }),
  });
}

export function useCheckoutCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => serviceAClient.checkoutCart(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: serviceAKeys.cart });
      qc.invalidateQueries({ queryKey: serviceAKeys.orders });
    },
  });
}

// ── Cart queries / mutations ──────────────────────────────────────────────────

export function useCart() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: serviceAKeys.cart,
    queryFn:  () => serviceAClient.getCart(),
    enabled:  !!token,
    staleTime: 30_000,
    gcTime:    5 * 60_000,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AddToCartRequest) => serviceAClient.addToCart(body),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceAKeys.cart }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateCartItemRequest) => serviceAClient.updateCartItem(body),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceAKeys.cart }),
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => serviceAClient.removeFromCart(productId),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceAKeys.cart }),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => serviceAClient.clearCart(),
    onSuccess:  () => qc.invalidateQueries({ queryKey: serviceAKeys.cart }),
  });
}
