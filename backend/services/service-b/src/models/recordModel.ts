'use strict';

import { Schema, model } from 'mongoose';
import { RECORD_STATUS_VALUES } from '../constants';
import { IRecord } from './types';

const recordSchema = new Schema<IRecord>(
  {
    title:   { type: String, required: [true, 'Title is required'],  trim: true, maxlength: [200,  'Title max 200 chars'] },
    content: { type: String, trim: true, default: '',                             maxlength: [5000, 'Content max 5000 chars'] },
    status:  { type: String, enum: RECORD_STATUS_VALUES, default: 'active' },
    refId:   { type: String, trim: true, default: '' },
  },
  { timestamps: true, versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

recordSchema.index({ title:     1 });
recordSchema.index({ status:    1 });
recordSchema.index({ refId:     1 });
recordSchema.index({ createdAt: -1 });

export default model<IRecord>('Record', recordSchema);
