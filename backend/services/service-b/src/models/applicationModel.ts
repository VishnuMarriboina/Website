'use strict';

import { Schema, model } from 'mongoose';
import { IApplication } from './types';

const APPLICATION_STATUS_VALUES = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type:     String,
      required: [true, 'userId is required'],
    },
    jobId: {
      type:     String,
      required: [true, 'jobId is required'],
    },
    resumeUrl: {
      type:    String,
      trim:    true,
      default: '',
    },
    coverLetter: {
      type:      String,
      trim:      true,
      default:   '',
      maxlength: [3000, 'Cover letter cannot exceed 3000 characters'],
    },
    applicationStatus: {
      type:    String,
      enum:    APPLICATION_STATUS_VALUES,
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

// Prevent duplicate applications (same user + same job)
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ jobId:    1 });
applicationSchema.index({ userId:   1 });
applicationSchema.index({ createdAt: -1 });

export default model<IApplication>('Application', applicationSchema);
