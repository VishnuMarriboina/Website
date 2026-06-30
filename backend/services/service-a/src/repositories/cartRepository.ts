'use strict';

import Cart from '../models/cartModel';
import { ICart, ICartItem } from '../models/types';

class CartRepository {
  async findByUserId(userId: string): Promise<ICart | null> {
    return Cart.findOne({ userId }).lean() as Promise<ICart | null>;
  }

  async upsertItem(userId: string, item: ICartItem): Promise<ICart> {
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, items: [], totalAmount: 0 } },
      { upsert: true, new: true, runValidators: true }
    );

    const idx = cart.items.findIndex((i) => i.productId === item.productId);
    if (idx >= 0) {
      cart.items[idx].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();
    return cart.toObject() as ICart;
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<ICart | null> {
    const cart = await Cart.findOne({ userId });
    if (!cart) return null;

    const idx = cart.items.findIndex((i) => i.productId === productId);
    if (idx < 0) return cart.toObject() as ICart;

    if (quantity <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = quantity;
    }

    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();
    return cart.toObject() as ICart;
  }

  async removeItem(userId: string, productId: string): Promise<ICart | null> {
    const cart = await Cart.findOne({ userId });
    if (!cart) return null;

    cart.items = cart.items.filter((i) => i.productId !== productId);
    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();
    return cart.toObject() as ICart;
  }

  async clearCart(userId: string): Promise<void> {
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], totalAmount: 0 } }
    );
  }

  async getOrCreate(userId: string): Promise<ICart> {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [], totalAmount: 0 });
    }
    return cart.toObject() as ICart;
  }
}

export default new CartRepository();
