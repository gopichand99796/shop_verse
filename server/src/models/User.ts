import mongoose, { Schema, model } from 'mongoose';

export interface Address {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  wishlist: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<Address>({
  label: { type: String, required: true, trim: true },
  line1: { type: String, required: true, trim: true },
  line2: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, trim: true },
  postalCode: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true }
});

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  addresses: { type: [addressSchema], default: [] },
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

userSchema.virtual('cart', {
  ref: 'Cart',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});
// email index already defined via schema option

export const User = model<IUser>('User', userSchema);
