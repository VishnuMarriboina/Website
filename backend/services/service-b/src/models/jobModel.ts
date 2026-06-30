'use strict';

import { Schema, model } from 'mongoose';
import { IJob } from './types';

const JOB_STATUS_VALUES = ['active', 'inactive', 'draft', 'archived'];

const jobSchema = new Schema<IJob>(
  {
    title: {
      type:      String,
      required:  [true, 'Title is required'],
      trim:      true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type:      String,
      trim:      true,
      default:   '',
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    department: {
      type:    String,
      trim:    true,
      default: '',
    },
    location: {
      type:    String,
      trim:    true,
      default: '',
    },
    experienceRequired: {
      type:    String,
      trim:    true,
      default: '',
    },
    salaryRange: {
      type:    String,
      trim:    true,
      default: '',
    },
    status: {
      type:    String,
      enum:    JOB_STATUS_VALUES,
      default: 'active',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

jobSchema.index({ title:      1 });
jobSchema.index({ status:     1 });
jobSchema.index({ department: 1 });
jobSchema.index({ createdAt:  -1 });

export default model<IJob>('Job', jobSchema);
