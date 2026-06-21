import { z } from 'zod';

export const productListQuery = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  ratingMin: z.coerce.number().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'rating', 'popular', 'newest']).optional(),
  featured: z.union([z.literal('1'), z.literal('0')]).optional(),
  lowStock: z.union([z.literal('1'), z.literal('0')]).optional()
});
