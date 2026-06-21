import { z } from 'zod';

export const addressSchema = z.object({
  label: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1)
});

export type AddressInput = z.infer<typeof addressSchema>;
