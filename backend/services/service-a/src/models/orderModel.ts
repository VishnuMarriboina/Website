'use strict';

import { Schema, model } from 'mongoose';
import { IOrder, IOrderProduct } from './types';

const ORDER_STATUS_VALUES   = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUS_VALUES = ['pending', 'paid', 'failed', 'refunded'];

const orderProductSchema = new Schema<IOrderProduct>(
  {
    productId:   { type: String, required: true },
    productName: { type: String, required: true },
    quantity:    { type: Number, required: true, min: 1 },
    price:       { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type:     String,
      required: [true, 'userId is required'],
    },
    products: {
      type:     [orderProductSchema],
      required: true,
      validate: {
        validator: (arr: IOrderProduct[]) => arr.length > 0,
        message:   'Order must contain at least one product',
      },
    },
    totalAmount: {
      type:    Number,
      default: 0,
      min:     [0, 'Total amount cannot be negative'],
    },
    orderStatus: {
      type:    String,
      enum:    ORDER_STATUS_VALUES,
      default: 'pending',
    },
    paymentStatus: {
      type:    String,
      enum:    PAYMENT_STATUS_VALUES,
      default: 'pending',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

orderSchema.index({ userId:      1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt:   -1 });

export default model<IOrder>('Order', orderSchema);
