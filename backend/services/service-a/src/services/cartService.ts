'use strict';

import cartRepository from '../repositories/cartRepository';
import productRepository from '../repositories/productRepository';
import orderRepository from '../repositories/orderRepository';
import { PRODUCT_ERROR_MESSAGES, CART_ERROR_MESSAGES } from '../constants';
import { NotFoundError, BadRequestError } from '../../../../shared/errors';
import { ICart, IOrder } from '../models/types';
import { AddToCartParams, UpdateCartItemParams } from './types';

class CartService {
  async addToCart(params: AddToCartParams): Promise<ICart> {
    const { userId, productId, quantity } = params;

    if (!productId) throw new BadRequestError('productId is required');
    if (!quantity || quantity < 1) throw new BadRequestError('quantity must be at least 1');

    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    if (product.stock < quantity) {
      throw new BadRequestError(
        `${PRODUCT_ERROR_MESSAGES.OUT_OF_STOCK} — available: ${product.stock}, requested: ${quantity}`
      );
    }

    return cartRepository.upsertItem(userId, {
      productId,
      productName: product.name,
      quantity,
      price: product.price,
    });
  }

  async getCart(userId: string): Promise<ICart> {
    return cartRepository.getOrCreate(userId);
  }

  async updateCartItem(params: UpdateCartItemParams): Promise<ICart> {
    const { userId, productId, quantity } = params;
    if (!productId) throw new BadRequestError('productId is required');
    if (quantity < 0) throw new BadRequestError('quantity cannot be negative');

    const cart = await cartRepository.updateItemQuantity(userId, productId, quantity);
    if (!cart) throw new NotFoundError(CART_ERROR_MESSAGES.NOT_FOUND);
    return cart;
  }

  async removeFromCart(userId: string, productId: string): Promise<ICart> {
    if (!productId) throw new BadRequestError('productId is required');
    const cart = await cartRepository.removeItem(userId, productId);
    if (!cart) throw new NotFoundError(CART_ERROR_MESSAGES.NOT_FOUND);
    return cart;
  }

  async clearCart(userId: string): Promise<void> {
    await cartRepository.clearCart(userId);
  }

  async checkoutCart(userId: string): Promise<IOrder> {
    const cart = await cartRepository.findByUserId(userId);
    if (!cart || cart.items.length === 0) throw new BadRequestError(CART_ERROR_MESSAGES.EMPTY);

    // Validate stock and decrement for all items
    for (const item of cart.items) {
      const product = await productRepository.findById(item.productId);
      if (!product) throw new NotFoundError(`Product "${item.productName}" is no longer available`);
      if (product.stock < item.quantity) {
        throw new BadRequestError(
          `Insufficient stock for "${item.productName}" — available: ${product.stock}, in cart: ${item.quantity}`
        );
      }
    }

    for (const item of cart.items) {
      await productRepository.decrementStock(item.productId, item.quantity);
    }

    const order = await orderRepository.create({
      userId,
      products: cart.items.map((i) => ({
        productId:   i.productId,
        productName: i.productName,
        quantity:    i.quantity,
        price:       i.price,
      })),
      totalAmount:   cart.totalAmount,
      orderStatus:   'pending',
      paymentStatus: 'pending',
    });

    await cartRepository.clearCart(userId);
    return order;
  }
}

export default new CartService();
