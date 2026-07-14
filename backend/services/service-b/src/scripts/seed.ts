'use strict';

/**
 * Seed script — service-b
 * Populates: Jobs (10), Applications (10)
 * WIPES all existing data before inserting fresh records every run.
 * Run: npm run seed  (from backend/services/service-b)
 *
 * NOTE: Requires service-a seed to have run first (to get valid userIds).
 */

import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../.env') });

import prisma from '../config/prisma';
import jobRepository from '../repositories/jobRepository';
import applicationRepository from '../repositories/applicationRepository';

const JOBS_DATA = [
  {
    title: 'Frontend Developer',
    description: 'Build and maintain our Web 2.0 and Web 3.0 interfaces using modern React and TypeScript. You will work closely with designers and backend engineers.',
    department: 'Engineering',
    location: 'Bengaluru, Karnataka',
    experienceRequired: '2-4 years',
    salaryRange: '₹8L - ₹15L per annum',
    status: 'active',
  },
  {
    title: 'Backend Developer',
    description: 'Design and maintain scalable gRPC microservices powering the ServCrust platform. Proficiency in Node.js and TypeScript required.',
    department: 'Engineering',
    location: 'Bengaluru, Karnataka',
    experienceRequired: '3-6 years',
    salaryRange: '₹12L - ₹22L per annum',
    status: 'active',
  },
  {
    title: 'QA Engineer',
    description: 'Enhance and own our automated testing framework to ensure platform reliability. Experience with Jest, Mocha, or Cypress preferred.',
    department: 'Quality Assurance',
    location: 'Remote',
    experienceRequired: '2-4 years',
    salaryRange: '₹7L - ₹13L per annum',
    status: 'active',
  },
  {
    title: 'Sales Executive',
    description: 'Analyse market data and customer surveys to drive growth across key territories. Strong communication and negotiation skills required.',
    department: 'Sales',
    location: 'Mumbai, Maharashtra',
    experienceRequired: '1-3 years',
    salaryRange: '₹5L - ₹10L per annum + incentives',
    status: 'active',
  },
  {
    title: 'Project Manager',
    description: 'Manage and oversee multiple projects within the program portfolio end-to-end. PMP certification preferred.',
    department: 'Operations',
    location: 'Bengaluru, Karnataka',
    experienceRequired: '5-8 years',
    salaryRange: '₹18L - ₹30L per annum',
    status: 'active',
  },
  {
    title: 'Business Analyst',
    description: 'Propose and implement streamlined processes to enhance operational efficiency. Experience with requirement gathering and JIRA required.',
    department: 'Business',
    location: 'Hyderabad, Telangana',
    experienceRequired: '2-5 years',
    salaryRange: '₹9L - ₹16L per annum',
    status: 'active',
  },
  {
    title: 'Operations Manager',
    description: 'Oversee day-to-day operations of the quarry and logistics teams. Prior experience in construction materials industry preferred.',
    department: 'Operations',
    location: 'Tumkur, Karnataka',
    experienceRequired: '5-10 years',
    salaryRange: '₹15L - ₹25L per annum',
    status: 'active',
  },
  {
    title: 'Site Engineer',
    description: 'Supervise on-site activities at quarry locations and ensure compliance with safety standards.',
    department: 'Engineering',
    location: 'Tumkur, Karnataka',
    experienceRequired: '3-6 years',
    salaryRange: '₹6L - ₹12L per annum',
    status: 'active',
  },
  {
    title: 'HR Executive',
    description: 'Manage recruitment, onboarding, and employee relations for a growing 100+ member team.',
    department: 'Human Resources',
    location: 'Bengaluru, Karnataka',
    experienceRequired: '2-4 years',
    salaryRange: '₹5L - ₹9L per annum',
    status: 'inactive',
  },
  {
    title: 'Marketing Specialist',
    description: 'Develop and execute digital marketing campaigns for brand awareness and lead generation in the B2B construction materials segment.',
    department: 'Marketing',
    location: 'Remote',
    experienceRequired: '2-5 years',
    salaryRange: '₹7L - ₹14L per annum',
    status: 'active',
  },
];

// [userIndex, jobIndex, applicationStatus]
const APPLICATIONS_SPEC: [number, number, string][] = [
  [0, 0, 'shortlisted'],
  [1, 1, 'reviewed'],
  [2, 2, 'pending'],
  [3, 3, 'shortlisted'],
  [4, 4, 'reviewed'],
  [5, 5, 'pending'],
  [6, 6, 'shortlisted'],
  [7, 7, 'reviewed'],
  [8, 8, 'pending'],
  [9, 9, 'shortlisted'],
];

async function seed() {
  console.log('[seed:service-b] Connecting to MySQL...');

  // ── Clear all tables ─────────────────────────────────────────────────────────
  console.log('\n[seed] Clearing existing data...');
  await prisma.application.deleteMany({});
  await prisma.job.deleteMany({});
  console.log('  Cleared: applications, jobs');

  // ── Jobs ─────────────────────────────────────────────────────────────────────
  console.log('\n[seed] Seeding jobs...');
  const insertedJobIds: string[] = [];
  for (const j of JOBS_DATA) {
    const created = await jobRepository.create(j);
    console.log(`  INSERT Job "${j.title}"  [${j.status}]`);
    insertedJobIds.push(created.id);
  }

  // ── Applications ─────────────────────────────────────────────────────────────
  console.log('\n[seed] Seeding applications...');

  // Read users inserted by service-a seed — same MySQL DB, query the users table directly
  const users = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM ServCrustProject.users ORDER BY createdAt ASC LIMIT 10
  `;

  if (users.length === 0) {
    console.log('  SKIP  Applications — no users found. Run service-a seed first.');
  } else {
    for (const [userIdx, jobIdx, applicationStatus] of APPLICATIONS_SPEC) {
      const user  = users[userIdx % users.length];
      const jobId = insertedJobIds[jobIdx];

      await applicationRepository.create({
        userId:            user.id,
        jobId,
        resumeUrl:         `https://cdn.example.com/resumes/user-${userIdx + 1}.pdf`,
        coverLetter:       'I am excited to apply for this position and believe my skills align well with your requirements.',
        applicationStatus,
      });
      console.log(`  INSERT Application — user[${userIdx}] → job "${JOBS_DATA[jobIdx].title}"  [${applicationStatus}]`);
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  const [jobCount, appCount] = await Promise.all([
    prisma.job.count(),
    prisma.application.count(),
  ]);

  console.log('\n[seed:service-b] Done!');
  console.log(`  Jobs:         ${jobCount}`);
  console.log(`  Applications: ${appCount}`);

  await prisma.$disconnect();
}

seed().catch(async (err) => {
  console.error('[seed:service-b] Error:', err);
  await prisma.$disconnect();
  process.exit(1);
});
