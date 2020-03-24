import { Document } from 'mongoose';

export interface PhoneVerification extends Document {
  phone: string;
  token: string;
  timestamp: Date;
}