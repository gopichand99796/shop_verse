import mongoose from 'mongoose';

export type ObjectId = mongoose.Types.ObjectId;

export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type CouponType = 'percent' | 'flat';
export type UserRole = 'customer' | 'admin';
