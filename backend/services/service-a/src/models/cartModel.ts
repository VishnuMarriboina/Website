'use strict';

import { Schema, model } from 'mongoose';
import { ICart, ICartItem } from './types';

const cartItemSchema = new Schema<ICartItem>(
  {
    productId:   { type: String, required: true },
    productName: { type: String, required: true },
    quantity:    { type: Number, required: true, min: 1 },
    price:       { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type:     String,
      required: [true, 'userId is required'],
      unique:   true,
    },
    items: {
      type:    [cartItemSchema],
      default: [],
    },
    totalAmount: {
      type:    Number,
      default: 0,
      min:     [0, 'Total amount cannot be negative'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

cartSchema.index({ userId: 1 }, { unique: true });

export default model<ICart>('Cart', cartSchema);
