import mongoose, { Schema, model } from 'mongoose';

export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface IStatusHistoryItem {
  status: OrderStatus;
  timestamp: Date;
}

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  qty: number;
  priceAtAdd: number;
}

export interface IOrder {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: {
    label: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: OrderStatus;
  coupon?: mongoose.Types.ObjectId;
  subtotal: number;
  discount: number;
  total: number;
  statusHistory: IStatusHistoryItem[];
  createdAt: Date;
  updatedAt: Date;
}

const statusHistorySchema = new Schema<IStatusHistoryItem>({
  status: { type: String, enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'], required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true, min: 1 },
  priceAtAdd: { type: Number, required: true, min: 0 }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], required: true },
  shippingAddress: {
    label: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true },
    state: { type: String, trim: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: { type: String, enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
  coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' },
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  statusHistory: { type: [statusHistorySchema], default: [{ status: 'placed', timestamp: new Date() }] },
  createdAt: { type: Date, default: Date.now }
});

orderSchema.index({ user: 1 });

orderSchema.virtual('isDelivered').get(function () {
  return this.orderStatus === 'delivered';
});

export const Order = model<IOrder>('Order', orderSchema);
