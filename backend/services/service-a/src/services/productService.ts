'use strict';

import productRepository from '../repositories/productRepository';
import { PRODUCT_ERROR_MESSAGES, PRODUCT_STATUS } from '../constants';
import { NotFoundError, ConflictError, BadRequestError } from '../../../../shared/errors';
import { IProduct } from '../models/types';
import { GetAllProductsParams, GetAllProductsResult, CreateProductParams } from './types';

class ProductService {
  async getAll(params: GetAllProductsParams = {}): Promise<GetAllProductsResult> {
    const { page, limit, status, category, search } = params;
    const filter: Record<string, unknown> = {};
    if (status)   filter['status']   = status;
    if (category) filter['category'] = new RegExp(category, 'i');
    if (search)   filter['name']     = new RegExp(search, 'i');

    const { data, total } = await productRepository.findAll({ filter, page, limit });
    return { data, total, page: page ?? 1, limit: limit ?? 10 };
  }

  async getById(id: string): Promise<IProduct> {
    if (!id) throw new BadRequestError(PRODUCT_ERROR_MESSAGES.INVALID_ID);
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    return product;
  }

  async create(params: CreateProductParams): Promise<IProduct> {
    const { name, description, category, image, price, stock, status } = params;
    const exists = await productRepository.existsByName(name);
    if (exists) throw new ConflictError(PRODUCT_ERROR_MESSAGES.NAME_EXISTS);
    return productRepository.create({ name, description, category, image, price, stock, status: status || PRODUCT_STATUS.ACTIVE });
  }

  async update(id: string, payload: Partial<IProduct>): Promise<IProduct> {
    if (!id) throw new BadRequestError(PRODUCT_ERROR_MESSAGES.INVALID_ID);
    if (payload.name) {
      const exists = await productRepository.existsByName(payload.name, id);
      if (exists) throw new ConflictError(PRODUCT_ERROR_MESSAGES.NAME_EXISTS);
    }
    const product = await productRepository.updateById(id, payload);
    if (!product) throw new NotFoundError(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    return product;
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    if (!id) throw new BadRequestError(PRODUCT_ERROR_MESSAGES.INVALID_ID);
    const product = await productRepository.deleteById(id);
    if (!product) throw new NotFoundError(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    return { deleted: true };
  }

  async activate(id: string): Promise<IProduct> {
    if (!id) throw new BadRequestError(PRODUCT_ERROR_MESSAGES.INVALID_ID);
    const product = await productRepository.updateById(id, { status: PRODUCT_STATUS.ACTIVE });
    if (!product) throw new NotFoundError(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    return product;
  }

  async deactivate(id: string): Promise<IProduct> {
    if (!id) throw new BadRequestError(PRODUCT_ERROR_MESSAGES.INVALID_ID);
    const product = await productRepository.updateById(id, { status: PRODUCT_STATUS.INACTIVE });
    if (!product) throw new NotFoundError(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    return product;
  }
}

export default new ProductService();
