'use strict';

/**
 * Seeds the 7 ServCrust job openings into MongoDB as Records.
 * Run: npm run seed:jobs
 *
 * Jobs are stored as Records with refId='jobs' and status='active'.
 * Safe to re-run — skips jobs that already exist by title.
 */

import mongoose from 'mongoose';
import config from '../config';
import Record from '../models/recordModel';

const JOBS = [
  {
    title:   'Frontend Developer',
    content: 'Build and maintain our Web 2.0 and Web 3.0 interfaces using modern React and TypeScript.',
    status:  'active',
    refId:   'jobs',
  },
  {
    title:   'Backend Developer',
    content: 'Design and maintain scalable gRPC microservices powering the ServCrust platform.',
    status:  'active',
    refId:   'jobs',
  },
  {
    title:   'QA Engineer',
    content: 'Enhance and own our automated testing framework to ensure platform reliability.',
    status:  'active',
    refId:   'jobs',
  },
  {
    title:   'Sales Executive',
    content: 'Analyse market data and customer surveys to drive growth across key territories.',
    status:  'active',
    refId:   'jobs',
  },
  {
    title:   'Project Manager',
    content: 'Manage and oversee multiple projects within the program portfolio end-to-end.',
    status:  'active',
    refId:   'jobs',
  },
  {
    title:   'Business Analyst',
    content: 'Propose and implement streamlined processes to enhance operational efficiency.',
    status:  'active',
    refId:   'jobs',
  },
  {
    title:   'Operations Manager',
    content: 'Lead day-to-day operations with expertise in logistics and team leadership.',
    status:  'active',
    refId:   'jobs',
  },
];

async function seed() {
  await mongoose.connect(config.db.uri);
  console.log('[seed] Connected to MongoDB:', config.db.uri);

  let inserted = 0;
  let skipped  = 0;

  for (const job of JOBS) {
    const exists = await Record.findOne({ title: job.title, refId: 'jobs' }).lean();
    if (exists) {
      console.log(`[seed] SKIP  "${job.title}" — already exists`);
      skipped++;
    } else {
      await Record.create(job);
      console.log(`[seed] INSERT "${job.title}"`);
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
