'use strict';

import { Schema, model } from 'mongoose';
import { ITEM_STATUS_VALUES } from '../constants';
import { IItem } from './types';

const itemSchema = new Schema<IItem>(
  {
    name: {
      type:      String,
      required:  [true, 'Name is required'],
      trim:      true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    description: {
      type:      String,
      trim:      true,
      default:   '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type:    String,
      enum:    ITEM_STATUS_VALUES,
      default: 'active',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

itemSchema.index({ name: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ createdAt: -1 });

const Item = model<IItem>('Item', itemSchema);

export default Item;
