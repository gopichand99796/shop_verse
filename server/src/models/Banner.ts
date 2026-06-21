import mongoose, { Schema, model } from 'mongoose';

export interface IBanner {
  image: string;
  title: string;
  link: string;
  isActive: boolean;
  order: number;
}

const bannerSchema = new Schema<IBanner>({
  image: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  link: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export const Banner = model<IBanner>('Banner', bannerSchema);
