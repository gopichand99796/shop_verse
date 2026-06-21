import mongoose, { Schema, model } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  parentCategory?: mongoose.Types.ObjectId;
  image?: string;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
  image: { type: String, trim: true }
}, { timestamps: true });

categorySchema.index({ slug: 1 });

categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

export const Category = model<ICategory>('Category', categorySchema);
