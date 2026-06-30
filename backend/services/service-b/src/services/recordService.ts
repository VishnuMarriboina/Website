'use strict';

import recordRepository from '../repositories/recordRepository';
import { ERROR_MESSAGES } from '../constants';
import { NotFoundError, ConflictError, BadRequestError } from '../../../../shared/errors';
import { IRecord } from '../models/types';
import { GetAllRecordsParams, GetAllRecordsResult, CreateRecordParams, UpdateRecordPayload } from './types';

class RecordService {
  async getAll(params: GetAllRecordsParams = {}): Promise<GetAllRecordsResult> {
    const { page, limit, status, refId } = params;
    const filter: Record<string, unknown> = {};
    if (status) filter['status'] = status;
    if (refId)  filter['refId']  = refId;
    return recordRepository.findAll({ filter, page, limit });
  }

  async getById(id: string): Promise<IRecord> {
    if (!id) throw new BadRequestError(ERROR_MESSAGES.INVALID_ID);
    const record = await recordRepository.findById(id);
    if (!record) throw new NotFoundError(ERROR_MESSAGES.RECORD_NOT_FOUND);
    return record;
  }

  async create(params: CreateRecordParams): Promise<IRecord> {
    const { title, content, status, refId } = params;
    const exists = await recordRepository.existsByTitle(title);
    if (exists) throw new ConflictError(ERROR_MESSAGES.RECORD_EXISTS);
    return recordRepository.create({ title, content, status, refId });
  }

  async update(id: string, payload: UpdateRecordPayload): Promise<IRecord> {
    if (!id) throw new BadRequestError(ERROR_MESSAGES.INVALID_ID);
    if (payload.title) {
      const exists = await recordRepository.existsByTitle(payload.title, id);
      if (exists) throw new ConflictError(ERROR_MESSAGES.RECORD_EXISTS);
    }
    const record = await recordRepository.updateById(id, payload);
    if (!record) throw new NotFoundError(ERROR_MESSAGES.RECORD_NOT_FOUND);
    return record;
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    if (!id) throw new BadRequestError(ERROR_MESSAGES.INVALID_ID);
    const record = await recordRepository.deleteById(id);
    if (!record) throw new NotFoundError(ERROR_MESSAGES.RECORD_NOT_FOUND);
    return { deleted: true };
  }
}

export default new RecordService();
