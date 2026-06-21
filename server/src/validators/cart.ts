import { z } from 'zod';

export const addToCartSchema = z.object({ productId: z.string().min(1), qty: z.number().int().min(1) });
export type AddToCartInput = z.infer<typeof addToCartSchema>;
