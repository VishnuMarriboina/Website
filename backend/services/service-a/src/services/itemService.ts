'use strict';

import itemRepository from '../repositories/itemRepository';
import { ERROR_MESSAGES } from '../constants';
import { NotFoundError, ConflictError, BadRequestError } from '../../../../shared/errors';
import { IItem } from '../models/types';
import { GetAllItemsParams, GetAllItemsResult, CreateItemParams } from './types';

class ItemService {
  async getAll(params: GetAllItemsParams = {}): Promise<GetAllItemsResult> {
    const { page, limit, status, search } = params;
    const filter: Record<string, unknown> = {};
    if (status) filter['status'] = status;
    if (search) filter['name']   = new RegExp(search, 'i');

    const { data, total } = await itemRepository.findAll({ filter, page, limit });
    return { data, total, page: page ?? 1, limit: limit ?? 10 };
  }

  async getById(id: string): Promise<IItem> {
    if (!id) throw new BadRequestError(ERROR_MESSAGES.INVALID_ID);

    const item = await itemRepository.findById(id);
    if (!item) throw new NotFoundError(ERROR_MESSAGES.ITEM_NOT_FOUND);

    return item;
  }

  async create(params: CreateItemParams): Promise<IItem> {
    const { name, description, status } = params;
    const exists = await itemRepository.existsByName(name);
    if (exists) throw new ConflictError(ERROR_MESSAGES.ITEM_NAME_EXISTS);

    return itemRepository.create({ name, description, status });
  }

  async update(id: string, payload: Partial<IItem>): Promise<IItem> {
    if (!id) throw new BadRequestError(ERROR_MESSAGES.INVALID_ID);

    if (payload.name) {
      const exists = await itemRepository.existsByName(payload.name, id);
      if (exists) throw new ConflictError(ERROR_MESSAGES.ITEM_NAME_EXISTS);
    }

    const item = await itemRepository.updateById(id, payload);
    if (!item) throw new NotFoundError(ERROR_MESSAGES.ITEM_NOT_FOUND);

    return item;
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    if (!id) throw new BadRequestError(ERROR_MESSAGES.INVALID_ID);

    const item = await itemRepository.deleteById(id);
    if (!item) throw new NotFoundError(ERROR_MESSAGES.ITEM_NOT_FOUND);

    return { deleted: true };
  }
}

export default new ItemService();
