'use strict';

import prisma from '../config/prisma';
import { ICart, ICartItem } from '../models/types';

function toICart(c: any): ICart {
  return {
    id:          c.id,
    userId:      c.userId,
    items:       (c.items ?? []).map((i: any): ICartItem => ({
      productId:   i.productId,
      productName: i.productName,
      quantity:    i.quantity,
      price:       i.price,
    })),
    totalAmount: c.totalAmount,
    createdAt:   c.createdAt,
    updatedAt:   c.updatedAt,
  };
}

class CartRepository {
  async findByUserId(userId: string): Promise<ICart | null> {
    const c = await prisma.cart.findUnique({ where: { userId }, include: { items: true } });
    return c ? toICart(c) : null;
  }

  async upsertItem(userId: string, item: ICartItem): Promise<ICart> {
    const result = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.upsert({
        where:  { userId },
        create: { userId, totalAmount: 0 },
        update: {},
      });

      const existing = await tx.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId: item.productId } },
      });

      if (existing) {
        await tx.cartItem.update({
          where: { cartId_productId: { cartId: cart.id, productId: item.productId } },
          data:  { quantity: { increment: item.quantity } },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId:      cart.id,
            productId:   item.productId,
            productName: item.productName,
            quantity:    item.quantity,
            price:       item.price,
          },
        });
      }

      const items       = await tx.cartItem.findMany({ where: { cartId: cart.id } });
      const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);
      return tx.cart.update({ where: { id: cart.id }, data: { totalAmount }, include: { items: true } });
    });
    return toICart(result);
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<ICart | null> {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return null;

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
    } else {
      await prisma.cartItem.updateMany({
        where: { cartId: cart.id, productId },
        data:  { quantity },
      });
    }

    const items       = await prisma.cartItem.findMany({ where: { cartId: cart.id } });
    const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const updated     = await prisma.cart.update({ where: { id: cart.id }, data: { totalAmount }, include: { items: true } });
    return toICart(updated);
  }

  async removeItem(userId: string, productId: string): Promise<ICart | null> {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return null;

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
    const items       = await prisma.cartItem.findMany({ where: { cartId: cart.id } });
    const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const updated     = await prisma.cart.update({ where: { id: cart.id }, data: { totalAmount }, include: { items: true } });
    return toICart(updated);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return;
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.update({ where: { id: cart.id }, data: { totalAmount: 0 } });
  }

  async getOrCreate(userId: string): Promise<ICart> {
    const c = await prisma.cart.upsert({
      where:   { userId },
      create:  { userId, totalAmount: 0 },
      update:  {},
      include: { items: true },
    });
    return toICart(c);
  }
}

export default new CartRepository();
