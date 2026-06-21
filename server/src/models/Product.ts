import mongoose, { Schema, model } from 'mongoose';

export interface IRating {
  avg: number;
  count: number;
}

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: mongoose.Types.ObjectId;
  brand: string;
  images: string[];
  stock: number;
  specs: Record<string, unknown>;
  tags: string[];
  ratings: IRating;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>({
  avg: { type: Number, default: 0 },
  count: { type: Number, default: 0 }
}, { _id: false });

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  brand: { type: String, required: true, trim: true },
  images: { type: [String], default: [] },
  stock: { type: Number, required: true, min: 0 },
  specs: { type: Schema.Types.Mixed, default: {} },
  tags: { type: [String], default: [] },
  ratings: { type: ratingSchema, default: () => ({}) },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });

productSchema.virtual('reviewCount', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  count: true
});
// Text and lookup indexes defined above

export const Product = model<IProduct>('Product', productSchema);
