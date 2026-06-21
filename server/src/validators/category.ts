import { z } from 'zod';

export const createCategorySchema = z.object({ name: z.string().min(1), slug: z.string().min(1), parentCategory: z.string().optional(), image: z.string().url().optional() });
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
