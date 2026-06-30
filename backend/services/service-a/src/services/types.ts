import { IItem, IProduct, IOrder, ICart } from '../models/types';

export interface GetAllItemsParams {
  page?:   number;
  limit?:  number;
  status?: string;
  search?: string;
}

export interface GetAllItemsResult {
  data:  IItem[];
  total: number;
  page:  number;
  limit: number;
}

export interface CreateItemParams {
  name:        string;
  description: string;
  status:      string;
}

export interface RegisterParams {
  name:     string;
  email:    string;
  password: string;
}

export interface LoginParams {
  email:    string;
  password: string;
}

export interface UserDto {
  id:        string;
  name:      string;
  email:     string;
  role:      string;
  createdAt: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  token:   string;
  user:    UserDto;
}

// ── Admin ──────────────────────────────────────────────────────────────────────

export interface AdminLoginParams {
  email:    string;
  password: string;
}

export interface AdminDto {
  id:        string;
  name:      string;
  email:     string;
  role:      string;
  createdAt: string;
}

export interface AdminAuthResult {
  success: boolean;
  message: string;
  token:   string;
  admin:   AdminDto;
}

// ── Product ───────────────────────────────────────────────────────────────────

export interface GetAllProductsParams {
  page?:     number;
  limit?:    number;
  status?:   string;
  category?: string;
  search?:   string;
}

export interface GetAllProductsResult {
  data:  IProduct[];
  total: number;
  page:  number;
  limit: number;
}

export interface CreateProductParams {
  name:        string;
  description: string;
  category:    string;
  image:       string;
  price:       number;
  stock:       number;
  status:      string;
}

// ── Order ─────────────────────────────────────────────────────────────────────

export interface CreateOrderParams {
  userId:    string;
  productId: string;
  quantity:  number;
}

export interface GetAllOrdersParams {
  page?:        number;
  limit?:       number;
  orderStatus?: string;
}

export interface GetAllOrdersResult {
  data:  IOrder[];
  total: number;
  page:  number;
  limit: number;
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export interface AddToCartParams {
  userId:    string;
  productId: string;
  quantity:  number;
}

export interface UpdateCartItemParams {
  userId:    string;
  productId: string;
  quantity:  number;
}

export interface CartResult {
  cart: ICart;
}
