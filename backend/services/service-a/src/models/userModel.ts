'use strict';

import mongoose from 'mongoose';
import { IUser } from './types';

const userSchema = new mongoose.Schema<IUser>(
  {
    name:         { type: String, required: true, trim: true, minlength: 2 },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
