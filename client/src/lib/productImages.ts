const productImageNames = new Set([
  '4K Ultra HD Smart TV 55 inch',
  'Adjustable Dumbbell Set',
  'Air Purifier HEPA Filter',
  'Classic Denim Jacket',
  'Cooking Masterclass Guide',
  'Cotton Blend T-Shirt Pack',
  'Designer Sunglasses',
  'LED Desk Lamp',
  'Laptop Pro 15 inch',
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
  'Wireless Bluetooth Headphones',
  'Wireless Gaming Mouse',
  'Wool Winter Scarf',
  'Yoga Mat Premium',
]);

export function getProductImage(product: any): string | undefined {
  const name = product?.name;
  if (typeof name !== 'string') {
    return undefined;
  }

  // Check if product has a specific image
  if (product.image) {
    return product.image;
  }

  // Check if product name is in the predefined list
  if (productImageNames.has(name)) {
    return `/products/${encodeURIComponent(name)}.png`;
  }

  // Check if product has images array
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }

  return undefined;
}
