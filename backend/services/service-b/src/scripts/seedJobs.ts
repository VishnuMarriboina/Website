'use strict';

/**
 * Seeds 7 ServCrust job openings into MySQL as Records.
 * Run: npm run seed:jobs
 *
 * Jobs are stored as Records with refId='jobs' and status='active'.
 * Safe to re-run — skips jobs that already exist by title.
 */

import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../.env') });

import prisma from '../config/prisma';
import recordRepository from '../repositories/recordRepository';

const JOBS = [
  { title: 'Frontend Developer',  content: 'Build and maintain our Web 2.0 and Web 3.0 interfaces using modern React and TypeScript.',   status: 'active', refId: 'jobs' },
  { title: 'Backend Developer',   content: 'Design and maintain scalable gRPC microservices powering the ServCrust platform.',             status: 'active', refId: 'jobs' },
  { title: 'QA Engineer',         content: 'Enhance and own our automated testing framework to ensure platform reliability.',              status: 'active', refId: 'jobs' },
  { title: 'Sales Executive',     content: 'Analyse market data and customer surveys to drive growth across key territories.',             status: 'active', refId: 'jobs' },
  { title: 'Project Manager',     content: 'Manage and oversee multiple projects within the program portfolio end-to-end.',               status: 'active', refId: 'jobs' },
  { title: 'Business Analyst',    content: 'Propose and implement streamlined processes to enhance operational efficiency.',               status: 'active', refId: 'jobs' },
  { title: 'Operations Manager',  content: 'Lead day-to-day operations with expertise in logistics and team leadership.',                 status: 'active', refId: 'jobs' },
];

async function seed() {
  console.log('[seed] Connecting to MySQL...');

  let inserted = 0;
  let skipped  = 0;

  for (const job of JOBS) {
    const exists = await recordRepository.findOne({ title: job.title, refId: 'jobs' });
    if (exists) {
      console.log(`[seed] SKIP  "${job.title}" — already exists`);
      skipped++;
    } else {
      await recordRepository.create(job);
      console.log(`[seed] INSERT "${job.title}"`);
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
