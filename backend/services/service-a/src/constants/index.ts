'use strict';

import { ItemStatusMap, ItemErrorMessages } from './types';

export const ITEM_STATUS: Readonly<ItemStatusMap> = Object.freeze({
  ACTIVE:   'active',
  INACTIVE: 'inactive',
  DRAFT:    'draft',
  ARCHIVED: 'archived',
});

export const ITEM_STATUS_VALUES: readonly string[] = Object.values(ITEM_STATUS);

export const ERROR_MESSAGES: Readonly<ItemErrorMessages> = Object.freeze({
  ITEM_NOT_FOUND:   'Item not found',
  ITEM_NAME_EXISTS: 'An item with this name already exists',
  INVALID_ID:       'Invalid item ID',
  CREATE_FAILED:    'Failed to create item',
  UPDATE_FAILED:    'Failed to update item',
  DELETE_FAILED:    'Failed to delete item',
});

// ── Product ──────────────────────────────────────────────────────────────────

export const PRODUCT_STATUS = Object.freeze({
  ACTIVE:   'active',
  INACTIVE: 'inactive',
  DRAFT:    'draft',
  ARCHIVED: 'archived',
});

export const PRODUCT_STATUS_VALUES: readonly string[] = Object.values(PRODUCT_STATUS);

export const PRODUCT_ERROR_MESSAGES = Object.freeze({
  NOT_FOUND:    'Product not found',
  NAME_EXISTS:  'A product with this name already exists',
  INVALID_ID:   'Invalid product ID',
  OUT_OF_STOCK: 'Insufficient stock for this product',
});

// ── Order ─────────────────────────────────────────────────────────────────────

export const ORDER_STATUS = Object.freeze({
  PENDING:   'pending',
  CONFIRMED: 'confirmed',
  SHIPPED:   'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
});

export const PAYMENT_STATUS = Object.freeze({
  PENDING:  'pending',
  PAID:     'paid',
  FAILED:   'failed',
  REFUNDED: 'refunded',
});

export const ORDER_ERROR_MESSAGES = Object.freeze({
  NOT_FOUND:    'Order not found',
  INVALID_ID:   'Invalid order ID',
  CREATE_FAILED: 'Failed to create order',
});

// ── Cart ──────────────────────────────────────────────────────────────────────

export const CART_ERROR_MESSAGES = Object.freeze({
  NOT_FOUND:    'Cart not found',
  EMPTY:        'Cart is empty',
  ITEM_NOT_FOUND: 'Item not found in cart',
});

// ── Admin ─────────────────────────────────────────────────────────────────────

export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  USER:  'USER',
});

export const ADMIN_ERROR_MESSAGES = Object.freeze({
  NOT_FOUND:    'Admin not found',
  EMAIL_EXISTS: 'Admin with this email already exists',
  INVALID_CRED: 'Invalid email or password',
});
