const productImageNames = new Set([
  '4K Ultra HD Smart TV 55 inch',
  'Adjustable Dumbbell Set',
  'Air Purifier HEPA Filter',
  'Cooking Masterclass Guide',
  'Cotton Blend T-Shirt Pack',
  'Designer Sunglasses',
  'LED Desk Lamp',
  'Memory Foam Pillow Set',
  'Mystery Novel Collection',
  'Premium Leather Sneakers',
  'Science Fiction Trilogy',
  'Self-Improvement Handbook',
  'Smart Coffee Maker',
  'Smartphone X Pro',
  'Stainless Steel Cookware Set',
  'Tennis Racket Pro',
  'The Art of Programming',
  'Water Bottle Insulated',
  'Wool Winter Scarf',
  'Yoga Mat Premium',
]);

export function getProductImage(product: any): string | undefined {
  const name = product?.name;
  if (typeof name !== 'string' || !productImageNames.has(name)) {
    return undefined;
  }

  return `/products/${encodeURIComponent(name)}.png`;
}
