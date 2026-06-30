'use strict';

/**
 * Seeds the 10 ServCrust stone aggregate products into MongoDB.
 * Run: npm run seed:products
 *
 * Safe to re-run — skips products that already exist by name.
 */

import mongoose from 'mongoose';
import config from '../config';
import Item from '../models/itemModel';

const PRODUCTS = [
  {
    name:        '60mm Stone Aggregates',
    description: 'Ideal for dams, retaining walls, and heavy civil engineering projects.',
    status:      'active',
  },
  {
    name:        '40mm Stone Aggregates',
    description: 'Commonly used in foundations, large concrete structures, and road sub-bases.',
    status:      'active',
  },
  {
    name:        '20mm Stone Aggregates',
    description: 'Standard size for concrete mixes, RCC work, and asphalt production.',
    status:      'active',
  },
  {
    name:        '12mm Stone Aggregates',
    description: 'Widely used in reinforced concrete, plastering, and column construction.',
    status:      'active',
  },
  {
    name:        '6mm Stone Aggregates',
    description: 'Finer-texture concrete mixes, paving blocks, and decorative work.',
    status:      'active',
  },
  {
    name:        'Manufactured Sand (M-Sand)',
    description: 'Crusher dust used as a fine aggregate replacement for river sand.',
    status:      'active',
  },
  {
    name:        'Stone Dust / Filler',
    description: 'Base for patios, walkways, and driveways; provides stability and level surface.',
    status:      'active',
  },
  {
    name:        'Wetmix',
    description: 'Provides a strong, stable sub-base layer for road construction.',
    status:      'active',
  },
  {
    name:        'GSB (Granular Sub Base)',
    description: 'Load-bearing foundation layer for national highways and state roads.',
    status:      'active',
  },
  {
    name:        'Gravel',
    description: 'Landscaping, drainage systems, and construction of roads and walkways.',
    status:      'active',
  },
];

async function seed() {
  await mongoose.connect(config.db.uri);
  console.log('[seed] Connected to MongoDB:', config.db.uri);

  let inserted = 0;
  let skipped  = 0;

  for (const product of PRODUCTS) {
    const exists = await Item.findOne({ name: product.name }).lean();
    if (exists) {
      console.log(`[seed] SKIP  "${product.name}" — already exists`);
      skipped++;
    } else {
      await Item.create(product);
      console.log(`[seed] INSERT "${product.name}"`);
      inserted++;
    }
  }

  console.log(`\n[seed] Done — ${inserted} inserted, ${skipped} skipped`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[seed] Error:', err);
  process.exit(1);
});
