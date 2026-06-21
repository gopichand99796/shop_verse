import mongoose, { Schema, model } from 'mongoose';

export interface ICoupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minOrderValue: number;
  expiryDate: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

const couponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  type: { type: String, enum: ['percent', 'flat'], required: true },
  value: { type: Number, required: true, min: 0 },
  minOrderValue: { type: Number, required: true, min: 0 },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, required: true, min: 0 },
  usedCount: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Coupon = model<ICoupon>('Coupon', couponSchema);
