import { Document } from "mongoose";

export interface User extends Document {
  phone: string;
  password: string;
  verified: boolean;
}