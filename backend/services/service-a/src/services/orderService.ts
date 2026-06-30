'use strict';

import orderRepository from '../repositories/orderRepository';
import productRepository from '../repositories/productRepository';
import { ORDER_ERROR_MESSAGES, PRODUCT_ERROR_MESSAGES } from '../constants';
import { NotFoundError, BadRequestError } from '../../../../shared/errors';
import { IOrder } from '../models/types';
import { CreateOrderParams, GetAllOrdersParams, GetAllOrdersResult } from './types';

class OrderService {
  async create(params: CreateOrderParams): Promise<IOrder> {
    const { userId, productId, quantity } = params;

    if (!userId)    throw new BadRequestError('userId is required');
    if (!productId) throw new BadRequestError('productId is required');
    if (!quantity || quantity < 1) throw new BadRequestError('quantity must be at least 1');

    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError(PRODUCT_ERROR_MESSAGES.NOT_FOUND);

    if (product.stock < quantity) {
      throw new BadRequestError(
        `${PRODUCT_ERROR_MESSAGES.OUT_OF_STOCK} — available: ${product.stock}, requested: ${quantity}`
      );
    }

    await productRepository.decrementStock(productId, quantity);

    const totalAmount = product.price * quantity;
    const order = await orderRepository.create({
      userId,
      products: [{ productId, productName: product.name, quantity, price: product.price }],
      totalAmount,
      orderStatus:   'pending',
      paymentStatus: 'pending',
    });

    return order;
  }

  async getById(id: string): Promise<IOrder> {
    if (!id) throw new BadRequestError(ORDER_ERROR_MESSAGES.INVALID_ID);
    const order = await orderRepository.findById(id);
    if (!order) throw new NotFoundError(ORDER_ERROR_MESSAGES.NOT_FOUND);
    return order;
  }

  async getAll(params: GetAllOrdersParams = {}): Promise<GetAllOrdersResult> {
    const { page, limit, orderStatus } = params;
    const filter: Record<string, unknown> = {};
    if (orderStatus) filter['orderStatus'] = orderStatus;

    const { data, total } = await orderRepository.findAll({ filter, page, limit });
    return { data, total, page: page ?? 1, limit: limit ?? 10 };
  }

  async getUserOrders(userId: string, page = 1, limit = 10): Promise<GetAllOrdersResult> {
    if (!userId) throw new BadRequestError('userId is required');
    const { data, total } = await orderRepository.findByUserId(userId, page, limit);
    return { data, total, page, limit };
  }

  async updateStatus(id: string, orderStatus: string): Promise<IOrder> {
    if (!id) throw new BadRequestError(ORDER_ERROR_MESSAGES.INVALID_ID);
    const VALID = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!VALID.includes(orderStatus)) throw new BadRequestError(`Invalid orderStatus: ${orderStatus}`);
    const order = await orderRepository.updateById(id, { orderStatus });
    if (!order) throw new NotFoundError(ORDER_ERROR_MESSAGES.NOT_FOUND);
    return order;
  }
}

export default new OrderService();
