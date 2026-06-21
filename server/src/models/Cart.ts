import mongoose, { Schema, model } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  qty: number;
  priceAtAdd: number;
}

export interface ICart {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true, min: 1 },
  priceAtAdd: { type: Number, required: true, min: 0 }
}, { _id: false });

const cartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  items: { type: [cartItemSchema], default: [] }
}, { timestamps: true });

export const Cart = model<ICart>('Cart', cartSchema);
