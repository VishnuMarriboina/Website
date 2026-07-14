'use strict';

/**
 * Seeds the 10 ServCrust stone aggregate items into MySQL.
 * Run: npm run seed:products
 *
 * Safe to re-run — skips items that already exist by name.
 */

import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../.env') });

import prisma from '../config/prisma';
import itemRepository from '../repositories/itemRepository';

const PRODUCTS = [
  { name: '60mm Stone Aggregates',      description: 'Ideal for dams, retaining walls, and heavy civil engineering projects.',       status: 'active' },
  { name: '40mm Stone Aggregates',      description: 'Commonly used in foundations, large concrete structures, and road sub-bases.', status: 'active' },
  { name: '20mm Stone Aggregates',      description: 'Standard size for concrete mixes, RCC work, and asphalt production.',          status: 'active' },
  { name: '12mm Stone Aggregates',      description: 'Widely used in reinforced concrete, plastering, and column construction.',     status: 'active' },
  { name: '6mm Stone Aggregates',       description: 'Finer-texture concrete mixes, paving blocks, and decorative work.',           status: 'active' },
  { name: 'Manufactured Sand (M-Sand)', description: 'Crusher dust used as a fine aggregate replacement for river sand.',            status: 'active' },
  { name: 'Stone Dust / Filler',        description: 'Base for patios, walkways, and driveways; provides stability and level surface.', status: 'active' },
  { name: 'Wetmix',                     description: 'Provides a strong, stable sub-base layer for road construction.',             status: 'active' },
  { name: 'GSB (Granular Sub Base)',    description: 'Load-bearing foundation layer for national highways and state roads.',        status: 'active' },
  { name: 'Gravel',                     description: 'Landscaping, drainage systems, and construction of roads and walkways.',      status: 'active' },
];

async function seed() {
  console.log('[seed] Connecting to MySQL...');

  let inserted = 0;
  let skipped  = 0;

  for (const product of PRODUCTS) {
    const exists = await itemRepository.findOne({ name: product.name });
    if (exists) {
      console.log(`[seed] SKIP  "${product.name}" — already exists`);
      skipped++;
    } else {
      await itemRepository.create(product);
      console.log(`[seed] INSERT "${product.name}"`);
      inserted++;
    }
  }

  console.log(`\n[seed] Done — ${inserted} inserted, ${skipped} skipped`);
  await prisma.$disconnect();
}

seed().catch(async (err) => {
  console.error('[seed] Error:', err);
  await prisma.$disconnect();
  process.exit(1);
});
