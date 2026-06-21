import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(z.object({ product: z.string().min(1), qty: z.number().int().min(1), priceAtAdd: z.number().nonnegative() })),
  shippingAddress: z.object({ label: z.string(), line1: z.string(), city: z.string(), postalCode: z.string(), country: z.string() }),
  paymentStatus: z.string().optional(),
  coupon: z.string().optional()
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
