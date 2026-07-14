'use strict';

import { IItem, IProduct, IOrder, ICart } from '../models/types';
import { GrpcItemDto, GrpcProductDto, GrpcOrderDto, GrpcCartDto } from './types';

export const itemToGrpc = (item: IItem): GrpcItemDto => ({
  id:          item.id          ?? '',
  name:        item.name        ?? '',
  description: item.description ?? '',
  status:      item.status      ?? 'active',
  createdAt:   item.createdAt   ? new Date(item.createdAt).toISOString() : '',
  updatedAt:   item.updatedAt   ? new Date(item.updatedAt).toISOString() : '',
});

export const productToGrpc = (p: IProduct): GrpcProductDto => ({
  id:          p.id          ?? '',
  name:        p.name        ?? '',
  description: p.description ?? '',
  category:    p.category    ?? '',
  image:       p.image       ?? '',
  price:       p.price       ?? 0,
  stock:       p.stock       ?? 0,
  status:      p.status      ?? 'active',
  createdAt:   p.createdAt   ? new Date(p.createdAt).toISOString() : '',
  updatedAt:   p.updatedAt   ? new Date(p.updatedAt).toISOString() : '',
});

export const cartToGrpc = (c: ICart): GrpcCartDto => ({
  id:          c.id          ?? '',
  userId:      c.userId      ?? '',
  items:       (c.items ?? []).map((ci) => ({
    productId:   ci.productId   ?? '',
    productName: ci.productName ?? '',
    quantity:    ci.quantity    ?? 0,
    price:       ci.price       ?? 0,
  })),
  totalAmount: c.totalAmount ?? 0,
  updatedAt:   c.updatedAt   ? new Date(c.updatedAt).toISOString() : '',
});

export const orderToGrpc = (o: IOrder): GrpcOrderDto => ({
  id:            o.id            ?? '',
  userId:        o.userId        ?? '',
  products:      (o.products ?? []).map((op) => ({
    productId:   op.productId   ?? '',
    productName: op.productName ?? '',
    quantity:    op.quantity    ?? 0,
    price:       op.price       ?? 0,
  })),
  totalAmount:   o.totalAmount   ?? 0,
  orderStatus:   o.orderStatus   ?? 'pending',
  paymentStatus: o.paymentStatus ?? 'pending',
  createdAt:     o.createdAt     ? new Date(o.createdAt).toISOString() : '',
});
