import * as mongoose from 'mongoose';

export const PhoneVerificationSchema = new mongoose.Schema({

  phone: {
    type: String,
    required: true,
    unique: true
  },
  ticket: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  timestamp: Date
}, {
  timestamps: false
});