import { z } from 'zod';

export const applyCouponSchema = z.object({ code: z.string().min(1) });
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;
