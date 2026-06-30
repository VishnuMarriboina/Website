'use strict';

import { Schema, model } from 'mongoose';
import { IProduct } from './types';

const PRODUCT_STATUS_VALUES = ['active', 'inactive', 'draft', 'archived'];

const productSchema = new Schema<IProduct>(
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
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type:    String,
      trim:    true,
      default: '',
    },
    image: {
      type:    String,
      trim:    true,
      default: '',
    },
    price: {
      type:    Number,
      default: 0,
      min:     [0, 'Price cannot be negative'],
    },
    stock: {
      type:    Number,
      default: 0,
      min:     [0, 'Stock cannot be negative'],
    },
    status: {
      type:    String,
      enum:    PRODUCT_STATUS_VALUES,
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

productSchema.index({ name:     1 });
productSchema.index({ status:   1 });
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });

export default model<IProduct>('Product', productSchema);
