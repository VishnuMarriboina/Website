'use strict';

/**
 * Seed script — service-a
 * Populates: Admins (2), Users (10), Products (20), Orders (20), Carts (6)
 * WIPES all existing data before inserting fresh records every run.
 * Run: npm run seed  (from backend/services/service-a)
 */

import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../.env') });

import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import * as adminRepository from '../repositories/adminRepository';
import * as userRepository from '../repositories/userRepository';
import productRepository from '../repositories/productRepository';
import orderRepository from '../repositories/orderRepository';
import cartRepository from '../repositories/cartRepository';

const SALT_ROUNDS = 10;

const ADMIN_DATA = [
  { name: 'Arjun Sharma', email: 'arjun.admin@store.com', password: 'Admin@123' },
  { name: 'Sneha Reddy',  email: 'sneha.admin@store.com', password: 'Admin@456' },
];

const USERS_DATA = [
  { name: 'Priya Mehta',  email: 'priya.mehta@gmail.com',  password: 'User@123'  },
  { name: 'Rahul Verma',  email: 'rahul.verma@gmail.com',  password: 'User@456'  },
  { name: 'Ananya K',     email: 'ananya.k@gmail.com',     password: 'User@789'  },
  { name: 'Karthik Nair', email: 'karthik.nair@gmail.com', password: 'User@1234' },
  { name: 'Divya Pillai', email: 'divya.pillai@gmail.com', password: 'User@1234' },
  { name: 'Suresh Iyer',  email: 'suresh.iyer@gmail.com',  password: 'User@1234' },
  { name: 'Meera Joshi',  email: 'meera.joshi@gmail.com',  password: 'User@1234' },
  { name: 'Vikram Singh', email: 'vikram.singh@gmail.com', password: 'User@1234' },
  { name: 'Lakshmi Rao',  email: 'lakshmi.rao@gmail.com',  password: 'User@1234' },
  { name: 'Aditya Kumar', email: 'aditya.kumar@gmail.com', password: 'User@1234' },
];

const PRODUCTS_DATA = [
  { name: '60mm Stone Aggregates',      description: 'Ideal for dams, retaining walls, and heavy civil engineering projects.',       category: 'Aggregates', image: '', price: 1800, stock: 500,  status: 'active' },
  { name: '40mm Stone Aggregates',      description: 'Commonly used in foundations, large concrete structures, and road sub-bases.', category: 'Aggregates', image: '', price: 1600, stock: 800,  status: 'active' },
  { name: '20mm Stone Aggregates',      description: 'Standard size for concrete mixes, RCC work, and asphalt production.',          category: 'Aggregates', image: '', price: 1400, stock: 1000, status: 'active' },
  { name: '12mm Stone Aggregates',      description: 'Widely used in reinforced concrete, plastering, and column construction.',     category: 'Aggregates', image: '', price: 1300, stock: 900,  status: 'active' },
  { name: '6mm Stone Aggregates',       description: 'Finer-texture concrete mixes, paving blocks, and decorative work.',           category: 'Aggregates', image: '', price: 1200, stock: 700,  status: 'active' },
  { name: 'Manufactured Sand (M-Sand)', description: 'Crusher dust used as a fine aggregate replacement for river sand.',            category: 'Sand',       image: '', price: 900,  stock: 1500, status: 'active' },
  { name: 'Stone Dust / Filler',        description: 'Base for patios, walkways, and driveways; provides stability.',               category: 'Dust',       image: '', price: 700,  stock: 2000, status: 'active' },
  { name: 'Wetmix',                     description: 'Provides a strong, stable sub-base layer for road construction.',             category: 'Road Base',  image: '', price: 1100, stock: 600,  status: 'active' },
  { name: 'GSB (Granular Sub Base)',    description: 'Load-bearing foundation layer for national highways and state roads.',        category: 'Road Base',  image: '', price: 1250, stock: 400,  status: 'active' },
  { name: 'Gravel',                     description: 'Landscaping, drainage systems, and construction of roads and walkways.',      category: 'Aggregates', image: '', price: 950,  stock: 1200, status: 'active' },
  { name: '80mm Stone Aggregates',      description: 'Heavy-duty foundation work for bridges and large infrastructure.',            category: 'Aggregates', image: '', price: 2000, stock: 300,  status: 'active' },
  { name: 'Crushed Rock',               description: 'Versatile fill material for construction sites and land levelling.',          category: 'Aggregates', image: '', price: 850,  stock: 1100, status: 'active' },
  { name: 'River Sand',                 description: 'Premium quality river sand for plastering and fine concrete work.',           category: 'Sand',       image: '', price: 1100, stock: 800,  status: 'active' },
  { name: 'P-Sand (Plastering Sand)',   description: 'Specially manufactured sand ideal for plastering and block work.',            category: 'Sand',       image: '', price: 850,  stock: 950,  status: 'active' },
  { name: 'Coarse Sand',                description: 'Used in heavy-duty concrete mix designs and road construction.',              category: 'Sand',       image: '', price: 780,  stock: 1300, status: 'active' },
  { name: 'Quarry Dust',                description: 'By-product of crushing; used as filler and sub-grade material.',             category: 'Dust',       image: '', price: 600,  stock: 2500, status: 'active' },
  { name: 'Black Metal (Grit)',         description: 'Smooth finish aggregate for internal flooring and tile bed.',                 category: 'Aggregates', image: '', price: 1350, stock: 600,  status: 'active' },
  { name: 'Concrete Mix Grade M20',     description: 'Ready-mixed concrete grade for residential slabs and beams.',                category: 'Concrete',   image: '', price: 4500, stock: 200,  status: 'active' },
  { name: 'Concrete Mix Grade M25',     description: 'High-strength mix for commercial construction and bridges.',                 category: 'Concrete',   image: '', price: 5200, stock: 150,  status: 'active' },
  { name: 'Pea Gravel',                 description: 'Small rounded stones ideal for decorative landscaping and drainage.',        category: 'Aggregates', image: '', price: 1050, stock: 700,  status: 'active' },
];

// [userIndex, [[productIndex, qty], ...], orderStatus, paymentStatus]
const ORDERS_SPEC: [number, [number, number][], string, string][] = [
  [0, [[2, 5], [5, 3]],         'delivered', 'paid'],
  [0, [[8, 2]],                 'cancelled', 'refunded'],
  [1, [[0, 1], [7, 4]],         'shipped',   'paid'],
  [1, [[3, 6]],                 'confirmed', 'paid'],
  [2, [[9, 2], [11, 3]],        'delivered', 'paid'],
  [2, [[17, 1]],                'pending',   'pending'],
  [3, [[4, 10], [6, 5]],        'confirmed', 'paid'],
  [3, [[12, 3], [13, 2]],       'shipped',   'paid'],
  [4, [[1, 4]],                 'delivered', 'paid'],
  [4, [[18, 1], [19, 2]],       'pending',   'pending'],
  [5, [[10, 1]],                'cancelled', 'failed'],
  [5, [[2, 8], [3, 4]],         'delivered', 'paid'],
  [6, [[16, 3], [15, 6]],       'confirmed', 'paid'],
  [6, [[5, 5]],                 'shipped',   'paid'],
  [7, [[0, 2], [7, 3], [8, 1]], 'delivered', 'paid'],
  [7, [[14, 7]],                'pending',   'pending'],
  [8, [[6, 10]],                'confirmed', 'paid'],
  [8, [[17, 2], [18, 1]],       'shipped',   'paid'],
  [9, [[9, 4], [11, 2]],        'delivered', 'paid'],
  [9, [[19, 1]],                'cancelled', 'refunded'],
];

// [userIndex, [[productIndex, qty], ...]]
const CARTS_SPEC: [number, [number, number][]][] = [
  [0, [[2, 2], [5, 1]]],
  [1, [[1, 3], [8, 2]]],
  [2, [[9, 1], [15, 5]]],
  [3, [[12, 2], [17, 1]]],
  [5, [[3, 4]]],
  [7, [[0, 1], [7, 2], [16, 3]]],
];

async function seed() {
  console.log('[seed:service-a] Connecting to MySQL...');

  // ── Clear all tables ─────────────────────────────────────────────────────────
  console.log('\n[seed] Clearing existing data...');
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.admin.deleteMany({});
  console.log('  Cleared: cartItems, carts, orderItems, orders, products, users, admins');

  // ── Admins ───────────────────────────────────────────────────────────────────
  console.log('\n[seed] Seeding admins...');
  for (const a of ADMIN_DATA) {
    const passwordHash = await bcrypt.hash(a.password, SALT_ROUNDS);
    await adminRepository.create({ name: a.name, email: a.email, passwordHash });
    console.log(`  INSERT Admin "${a.email}"  password: ${a.password}`);
  }

  // ── Users ────────────────────────────────────────────────────────────────────
  console.log('\n[seed] Seeding users...');
  const insertedUserIds: string[] = [];
  for (const u of USERS_DATA) {
    const passwordHash = await bcrypt.hash(u.password, SALT_ROUNDS);
    const created = await userRepository.create({ name: u.name, email: u.email, passwordHash });
    console.log(`  INSERT User "${u.email}"  password: ${u.password}`);
    insertedUserIds.push(created.id);
  }

  // ── Products ─────────────────────────────────────────────────────────────────
  console.log('\n[seed] Seeding products...');
  const insertedProducts: { id: string; name: string; price: number }[] = [];
  for (const p of PRODUCTS_DATA) {
    const created = await productRepository.create(p);
    console.log(`  INSERT Product "${p.name}"  ₹${p.price}`);
    insertedProducts.push({ id: created.id, name: p.name, price: p.price });
  }

  // ── Orders ───────────────────────────────────────────────────────────────────
  console.log('\n[seed] Seeding orders...');
  for (const [userIdx, lines, orderStatus, paymentStatus] of ORDERS_SPEC) {
    const userId  = insertedUserIds[userIdx];
    const products = lines.map(([prodIdx, qty]) => ({
      productId:   insertedProducts[prodIdx].id,
      productName: insertedProducts[prodIdx].name,
      quantity:    qty,
      price:       insertedProducts[prodIdx].price,
    }));
    const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    await orderRepository.create({ userId, totalAmount, orderStatus, paymentStatus, products });
    const label = products.map(p => `${p.productName} ×${p.quantity}`).join(', ');
    console.log(`  INSERT Order — user[${userIdx}] [${orderStatus}/${paymentStatus}] — ${label} — ₹${totalAmount.toLocaleString()}`);
  }

  // ── Carts ────────────────────────────────────────────────────────────────────
  console.log('\n[seed] Seeding carts...');
  for (const [userIdx, lines] of CARTS_SPEC) {
    const userId = insertedUserIds[userIdx];
    for (const [prodIdx, qty] of lines) {
      await cartRepository.upsertItem(userId, {
        productId:   insertedProducts[prodIdx].id,
        productName: insertedProducts[prodIdx].name,
        quantity:    qty,
        price:       insertedProducts[prodIdx].price,
      });
    }
    const label = lines.map(([prodIdx, qty]) => `${insertedProducts[prodIdx].name} ×${qty}`).join(', ');
    console.log(`  INSERT Cart  — user[${userIdx}] — ${label}`);
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  const [adminCount, userCount, productCount, orderCount, cartCount] = await Promise.all([
    prisma.admin.count(),
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.cart.count(),
  ]);

  console.log('\n[seed:service-a] Done!');
  console.log(`  Admins:   ${adminCount}`);
  console.log(`  Users:    ${userCount}`);
  console.log(`  Products: ${productCount}`);
  console.log(`  Orders:   ${orderCount}`);
  console.log(`  Carts:    ${cartCount}`);

  await prisma.$disconnect();
}

seed().catch(async (err) => {
  console.error('[seed:service-a] Error:', err);
  await prisma.$disconnect();
  process.exit(1);
});
