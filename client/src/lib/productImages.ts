export const imageMap: Record<string, string> = {
  "Smartphone X Pro": "/products/Gemini_Generated_Image_4c03354c03354c03.png",
  "4K Ultra HD Smart TV 55 inch": "/products/Gemini_Generated_Image_4c03354c03354c03-2.png",
  "Cotton Blend T-Shirt Pack": "/products/Gemini_Generated_Image_4c03354c03354c03-3.png",
  "Designer Sunglasses": "/products/Gemini_Generated_Image_4c03354c03354c03-4.png",
  "Wool Winter Scarf": "/products/Gemini_Generated_Image_4c03354c03354c03-5.png",
  "Smart Coffee Maker": "/products/Gemini_Generated_Image_4c03354c03354c03-6.png",
  "Stainless Steel Cookware Set": "/products/Gemini_Generated_Image_4c03354c03354c03-7.png",
  "Memory Foam Pillow Set": "/products/Gemini_Generated_Image_4c03354c03354c03-8.png",
  "LED Desk Lamp": "/products/Gemini_Generated_Image_4c03354c03354c03-9.png",
  "Air Purifier HEPA Filter": "/products/Gemini_Generated_Image_4c03354c03354c03-10.png",
  "Water Bottle Insulated": "/products/Gemini_Generated_Image_4c03354c03354c03-11.png",
  "Professional Running Shoes": "/products/Gemini_Generated_Image_4c03354c03354c03-12.png",
  "Yoga Mat Premium": "/products/Gemini_Generated_Image_4c03354c03354c03-13.png",
  "Adjustable Dumbbell Set": "/products/Gemini_Generated_Image_4c03354c03354c03-14.png",
  "Tennis Racket Pro": "/products/Gemini_Generated_Image_4c03354c03354c03-15.png",
  "Cooking Masterclass Guide": "/products/Gemini_Generated_Image_4c03354c03354c03-16.png",
  "The Art of Programming": "/products/Gemini_Generated_Image_4c03354c03354c03-17.png",
  "Self-Improvement Handbook": "/products/Gemini_Generated_Image_4c03354c03354c03-18.png",
  "Science Fiction Trilogy": "/products/Gemini_Generated_Image_4c03354c03354c03-19.png",
  "Mystery Novel Collection": "/products/Gemini_Generated_Image_4c03354c03354c03-20.png"
};

export function getProductImage(product: any): string {
  return imageMap[product?.name] || product?.images?.[0] || '/products/fallback.png';
}
