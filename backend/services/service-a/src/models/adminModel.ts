'use strict';

import mongoose from 'mongoose';
import { IAdmin } from './types';

const adminSchema = new mongoose.Schema<IAdmin>(
  {
    name:         { type: String, required: true, trim: true, minlength: 2 },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, default: 'ADMIN', immutable: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAdmin>('Admin', adminSchema);
