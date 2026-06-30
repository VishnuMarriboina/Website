'use strict';

import { RecordStatusMap, RecordErrorMessages } from './types';

export const RECORD_STATUS: Readonly<RecordStatusMap> = Object.freeze({
  ACTIVE:   'active',
  INACTIVE: 'inactive',
  DRAFT:    'draft',
  ARCHIVED: 'archived',
});

export const RECORD_STATUS_VALUES: readonly string[] = Object.values(RECORD_STATUS);

export const ERROR_MESSAGES: Readonly<RecordErrorMessages> = Object.freeze({
  RECORD_NOT_FOUND: 'Record not found',
  RECORD_EXISTS:    'A record with this title already exists',
  INVALID_ID:       'Invalid record ID',
});

// ── Job ───────────────────────────────────────────────────────────────────────

export const JOB_STATUS = Object.freeze({
  ACTIVE:   'active',
  INACTIVE: 'inactive',
  DRAFT:    'draft',
  ARCHIVED: 'archived',
});

export const JOB_STATUS_VALUES: readonly string[] = Object.values(JOB_STATUS);

export const JOB_ERROR_MESSAGES = Object.freeze({
  NOT_FOUND:   'Job not found',
  TITLE_EXISTS: 'A job with this title already exists',
  INVALID_ID:  'Invalid job ID',
});

// ── Application ───────────────────────────────────────────────────────────────

export const APPLICATION_STATUS = Object.freeze({
  PENDING:     'pending',
  REVIEWED:    'reviewed',
  SHORTLISTED: 'shortlisted',
  REJECTED:    'rejected',
  HIRED:       'hired',
});

export const APPLICATION_ERROR_MESSAGES = Object.freeze({
  NOT_FOUND:   'Application not found',
  DUPLICATE:   'You have already applied for this job',
  INVALID_ID:  'Invalid application ID',
});
