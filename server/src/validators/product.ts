import { z } from 'zod';
import mongoose from 'mongoose';

export const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  discountPrice: z.number().nonnegative().optional(),
  category: z.string().min(1),
  brand: z.string().min(1),
  images: z.array(z.string().url()).optional(),
  stock: z.number().int().nonnegative(),
  specs: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional()
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
