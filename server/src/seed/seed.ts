import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { Coupon } from '../models/Coupon';
import { Banner } from '../models/Banner';
import { Review } from '../models/Review';

dotenv.config();

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

async function seedAdminUser() {
  const adminHash = await bcrypt.hash('AdminPass123!', SALT_ROUNDS);
  const userHash = await bcrypt.hash('CustomerPass123!', SALT_ROUNDS);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@shopverse.test',
    passwordHash: adminHash,
    role: 'admin'
  });

  const customer = await User.create({
    name: 'Jane Customer',
    email: 'jane@shopverse.test',
    passwordHash: userHash,
    role: 'customer',
    addresses: [
      {
        label: 'Home',
        line1: '123 Market St',
        city: 'Metropolis',
        postalCode: '12345',
        country: 'USA'
      }
    ]
  });

  return { admin, customer };
}

async function seedCategories() {
  const electronics = await Category.create({ name: 'Electronics', slug: 'electronics' });
  const fashion = await Category.create({ name: 'Fashion', slug: 'fashion' });
  const homeKitchen = await Category.create({ name: 'Home & Kitchen', slug: 'home-kitchen' });
  const sports = await Category.create({ name: 'Sports', slug: 'sports' });
  const books = await Category.create({ name: 'Books', slug: 'books' });

  return { electronics, fashion, homeKitchen, sports, books };
}

async function seedProducts(categories: any) {
  const { electronics, fashion, homeKitchen, sports, books } = categories;

  const products = [
    // Electronics
    {
      name: 'Wireless Bluetooth Headphones',
      slug: 'wireless-bluetooth-headphones',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear audio quality.',
      price: 149.99,
      discountPrice: 119.99,
      category: electronics._id,
      brand: 'SoundMax',
      images: ['https://images.unsplash.com/photo-1518441902112-0fa1b6bc8630?auto=format&fit=crop&w=800&q=80'],
      stock: 50,
      specs: { battery: '30 hours', connectivity: 'Bluetooth 5.0', weight: '250g' },
      tags: ['wireless', 'audio', 'bluetooth'],
      ratings: { avg: 4.5, count: 234 },
      isFeatured: true,
      isActive: true
    },
    {
      name: '4K Ultra HD Smart TV 55 inch',
      slug: '4k-ultra-hd-smart-tv-55-inch',
      description: 'Stunning 4K resolution with smart TV capabilities, built-in streaming apps, and voice control.',
      price: 699.99,
      discountPrice: 599.99,
      category: electronics._id,
      brand: 'ViewTech',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'],
      stock: 25,
      specs: { display: '55 inch 4K', refreshRate: '120Hz', smartFeatures: true },
      tags: ['tv', 'smart', '4k'],
      ratings: { avg: 4.7, count: 189 },
      isFeatured: true,
      isActive: true
    },
    {
      name: 'Laptop Pro 15 inch',
      slug: 'laptop-pro-15-inch',
      description: 'High-performance laptop with 16GB RAM, 512GB SSD, and powerful processor for work and gaming.',
      price: 1299.99,
      discountPrice: 1149.99,
      category: electronics._id,
      brand: 'TechBook',
      images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'],
      stock: 30,
      specs: { ram: '16GB', storage: '512GB SSD', processor: 'Intel i7' },
      tags: ['laptop', 'computer', 'work'],
      ratings: { avg: 4.6, count: 156 },
      isFeatured: true,
      isActive: true
    },
    {
      name: 'Smartphone X Pro',
      slug: 'smartphone-x-pro',
      description: 'Latest flagship smartphone with 5G, triple camera system, and all-day battery life.',
      price: 999.99,
      discountPrice: 849.99,
      category: electronics._id,
      brand: 'MobileTech',
      images: ['https://images.unsplash.com/photo-1512499617640-c2f999018b72?auto=format&fit=crop&w=800&q=80'],
      stock: 40,
      specs: { screen: '6.7 inch', storage: '256GB', camera: 'Triple 12MP' },
      tags: ['smartphone', '5g', 'camera'],
      ratings: { avg: 4.8, count: 312 },
      isFeatured: true,
      isActive: true
    },
    {
      name: 'Wireless Gaming Mouse',
      slug: 'wireless-gaming-mouse',
      description: 'Precision gaming mouse with RGB lighting, programmable buttons, and ultra-low latency.',
      price: 79.99,
      discountPrice: 64.99,
      category: electronics._id,
      brand: 'GameGear',
      images: ['https://images.unsplash.com/photo-1516594798945-5e5ea0ec355f?auto=format&fit=crop&w=800&q=80'],
      stock: 60,
      specs: { dpi: '16000', buttons: 8, wireless: true },
      tags: ['gaming', 'mouse', 'wireless'],
      ratings: { avg: 4.4, count: 98 },
      isFeatured: false,
      isActive: true
    },
    // Fashion
    {
      name: 'Classic Denim Jacket',
      slug: 'classic-denim-jacket',
      description: 'Timeless denim jacket with a modern fit, perfect for casual outings and layering.',
      price: 89.99,
      discountPrice: 69.99,
      category: fashion._id,
      brand: 'UrbanStyle',
      images: ['https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=800&q=80'],
      stock: 45,
      specs: { material: '100% Cotton', sizes: 'S-XXL', fit: 'Regular' },
      tags: ['jacket', 'denim', 'casual'],
      ratings: { avg: 4.3, count: 167 },
      isFeatured: true,
      isActive: true
    },
    {
      name: 'Premium Leather Sneakers',
      slug: 'premium-leather-sneakers',
      description: 'Handcrafted leather sneakers with cushioned insoles for all-day comfort and style.',
      price: 129.99,
      discountPrice: 99.99,
      category: fashion._id,
      brand: 'StepUp',
      images: ['https://images.unsplash.com/photo-1528701800489-20b6f665f9f7?auto=format&fit=crop&w=800&q=80'],
      stock: 35,
      specs: { material: 'Genuine Leather', sizes: '7-13', sole: 'Rubber' },
      tags: ['shoes', 'sneakers', 'leather'],
      ratings: { avg: 4.6, count: 203 },
      isFeatured: true,
      isActive: true
    },
    {
      name: 'Cotton Blend T-Shirt Pack',
      slug: 'cotton-blend-t-shirt-pack',
      description: 'Pack of 3 premium cotton blend t-shirts in classic colors, soft and breathable.',
      price: 49.99,
      discountPrice: 39.99,
      category: fashion._id,
      brand: 'BasicWear',
      images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80'],
      stock: 80,
      specs: { material: 'Cotton Blend', sizes: 'S-XXL', pack: 3 },
      tags: ['tshirt', 'casual', 'pack'],
      ratings: { avg: 4.2, count: 145 },
      isFeatured: false,
      isActive: true
    },
    {
      name: 'Wool Winter Scarf',
      slug: 'wool-winter-scarf',
      description: 'Soft merino wool scarf to keep you warm during cold weather, available in multiple colors.',
      price: 39.99,
      discountPrice: 29.99,
      category: fashion._id,
      brand: 'CozyWear',
      images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80'],
      stock: 55,
      specs: { material: 'Merino Wool', length: '180cm', colors: 5 },
      tags: ['scarf', 'winter', 'accessory'],
      ratings: { avg: 4.5, count: 89 },
      isFeatured: false,
      isActive: true
    },
    {
      name: 'Designer Sunglasses',
      slug: 'designer-sunglasses',
      description: 'UV-protected designer sunglasses with polarized lenses and stylish frames.',
      price: 159.99,
      discountPrice: 129.99,
      category: fashion._id,
      brand: 'VisionPro',
      images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80'],
      stock: 25,
      specs: { protection: 'UV400', lens: 'Polarized', frame: 'Metal' },
      tags: ['sunglasses', 'accessory', 'uv-protection'],
      ratings: { avg: 4.4, count: 76 },
      isFeatured: true,
      isActive: true
    },
    // Home & Kitchen
    {
      name: 'Stainless Steel Cookware Set',
      slug: 'stainless-steel-cookware-set',
      description: '10-piece professional cookware set with non-stick coating and heat-resistant handles.',
      price: 199.99,
      discountPrice: 159.99,
      category: homeKitchen._id,
      brand: 'ChefMaster',
      images: ['https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80'],
      stock: 20,
      specs: { pieces: 10, material: 'Stainless Steel', coating: 'Non-stick' },
      tags: ['cookware', 'kitchen', 'set'],
      ratings: { avg: 4.7, count: 234 },
      isFeatured: true,
      isActive: true
    },
    {
      name: 'Smart Coffee Maker',
      slug: 'smart-coffee-maker',
      description: 'WiFi-enabled coffee maker with programmable brewing, temperature control, and app integration.',
      price: 149.99,
      discountPrice: 119.99,
      category: homeKitchen._id,
      brand: 'BrewTech',
      images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'],
      stock: 30,
      specs: { capacity: '12 cups', connectivity: 'WiFi', programmable: true },
      tags: ['coffee', 'kitchen', 'smart'],
      ratings: { avg: 4.5, count: 167 },
      isFeatured: true,
      isActive: true
    },
    {
      name: 'Memory Foam Pillow Set',
      slug: 'memory-foam-pillow-set',
      description: 'Set of 2 premium memory foam pillows with cooling gel layer for better sleep.',
      price: 79.99,
      discountPrice: 59.99,
      category: homeKitchen._id,
      brand: 'SleepWell',
      images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'],
      stock: 40,
      specs: { material: 'Memory Foam', cooling: true, pack: 2 },
      tags: ['pillow', 'bedding', 'sleep'],
      ratings: { avg: 4.6, count: 198 },
      isFeatured: false,
      isActive: true
    },
    {
      name: 'LED Desk Lamp',
      slug: 'led-desk-lamp',
      description: 'Adjustable LED desk lamp with multiple brightness levels, color temperature control, and USB charging port.',
      price: 49.99,
      discountPrice: 39.99,
      category: homeKitchen._id,
      brand: 'BrightLight',
      images: ['https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=80'],
      stock: 50,
      specs: { brightness: '5 levels', usbPort: true, adjustable: true },
      tags: ['lamp', 'desk', 'led'],
      ratings: { avg: 4.3, count: 112 },
      isFeatured: false,
      isActive: true
    },
    {
      name: 'Air Purifier HEPA Filter',
      slug: 'air-purifier-hepa-filter',
      description: 'True HEPA air purifier that removes 99.97% of allergens, perfect for large rooms.',
      price: 249.99,
      discountPrice: 199.99,
      category: homeKitchen._id,
      brand: 'PureAir',
      images: ['https://images.unsplash.com/photo-1582719478184-9f6e8bd5eb1f?auto=format&fit=crop&w=800&q=80'],
      stock: 15,
      specs: { coverage: '500 sq ft', filter: 'True HEPA', noiseLevel: '24dB' },
      tags: ['air-purifier', 'home', 'health'],
      ratings: { avg: 4.8, count: 87 },
      isFeatured: true,
      isActive: true
    },
    // Sports
    {
      name: 'Professional Running Shoes',
      slug: 'professional-running-shoes',
      description: 'Lightweight running shoes with advanced cushioning and breathable mesh for marathon training.',
      price: 139.99,
      discountPrice: 109.99,
      category: sports._id,
      brand: 'SpeedRun',
      images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'],
      stock: 45,
      specs: { weight: '250g', cushioning: 'Advanced', sizes: '6-13' },
      tags: ['running', 'shoes', 'fitness'],
      ratings: { avg: 4.7, count: 289 },
      isFeatured: true,
      isActive: true
    },
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description: 'Extra-thick non-slip yoga mat with alignment lines, perfect for all types of yoga practice.',
      price: 49.99,
      discountPrice: 39.99,
      category: sports._id,
      brand: 'ZenFit',
      images: ['https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=800&q=80'],
      stock: 60,
      specs: { thickness: '6mm', material: 'TPE', nonSlip: true },
      tags: ['yoga', 'fitness', 'mat'],
      ratings: { avg: 4.5, count: 156 },
      isFeatured: false,
      isActive: true
    },
    {
      name: 'Adjustable Dumbbell Set',
      slug: 'adjustable-dumbbell-set',
      description: 'Space-saving adjustable dumbbell set with weight range from 5 to 52.5 lbs per dumbbell.',
      price: 299.99,
      discountPrice: 249.99,
      category: sports._id,
      brand: 'StrengthPro',
      images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80'],
      stock: 20,
      specs: { weightRange: '5-52.5 lbs', adjustable: true, material: 'Cast Iron' },
      tags: ['weights', 'fitness', 'strength'],
      ratings: { avg: 4.6, count: 134 },
      isFeatured: true,
      isActive: true
    },
    {
      name: 'Water Bottle Insulated',
      slug: 'water-bottle-insulated',
      description: 'Double-wall insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
      price: 29.99,
      discountPrice: 24.99,
      category: sports._id,
      brand: 'HydroMax',
      images: ['https://images.unsplash.com/photo-1508654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80'],
      stock: 75,
      specs: { capacity: '32oz', insulation: 'Double-wall', material: 'Stainless Steel' },
      tags: ['bottle', 'hydration', 'sports'],
      ratings: { avg: 4.4, count: 267 },
      isFeatured: false,
      isActive: true
    },
    {
      name: 'Tennis Racket Pro',
      slug: 'tennis-racket-pro',
      description: 'Professional-grade tennis racket with carbon fiber frame for optimal power and control.',
      price: 189.99,
      discountPrice: 159.99,
      category: sports._id,
      brand: 'CourtKing',
      images: ['https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80'],
      stock: 25,
      specs: { weight: '300g', headSize: '100 sq in', material: 'Carbon Fiber' },
      tags: ['tennis', 'racket', 'sports'],
      ratings: { avg: 4.5, count: 78 },
      isFeatured: true,
      isActive: true
    },
    // Books
    {
      name: 'The Art of Programming',
      slug: 'the-art-of-programming',
      description: 'Comprehensive guide to modern programming practices, algorithms, and software design principles.',
      price: 49.99,
      discountPrice: 39.99,
      category: books._id,
      brand: 'TechBooks',
      images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'],
      stock: 40,
      specs: { pages: 450, format: 'Hardcover', language: 'English' },
      tags: ['programming', 'technology', 'education'],
      ratings: { avg: 4.8, count: 345 },
      isFeatured: true,
      isActive: true
    },
    {
      name: 'Mystery Novel Collection',
      slug: 'mystery-novel-collection',
      description: 'Box set of 5 bestselling mystery novels from award-winning authors.',
      price: 34.99,
      discountPrice: 27.99,
      category: books._id,
      brand: 'StoryPress',
      images: ['https://images.unsplash.com/photo-1496104679561-38d6dc8b160e?auto=format&fit=crop&w=800&q=80'],
      stock: 30,
      specs: { books: 5, format: 'Paperback', genre: 'Mystery' },
      tags: ['mystery', 'fiction', 'collection'],
      ratings: { avg: 4.6, count: 189 },
      isFeatured: false,
      isActive: true
    },
    {
      name: 'Cooking Masterclass Guide',
      slug: 'cooking-masterclass-guide',
      description: 'Learn culinary arts with 100+ recipes, techniques, and tips from professional chefs.',
      price: 39.99,
      discountPrice: 29.99,
      category: books._id,
      brand: 'CulinaryBooks',
      images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'],
      stock: 35,
      specs: { pages: 320, format: 'Hardcover', recipes: 100 },
      tags: ['cooking', 'recipes', 'culinary'],
      ratings: { avg: 4.7, count: 156 },
      isFeatured: true,
      isActive: true
    },
    {
      name: 'Self-Improvement Handbook',
      slug: 'self-improvement-handbook',
      description: 'Practical guide to personal development, productivity, and achieving your goals.',
      price: 24.99,
      discountPrice: 19.99,
      category: books._id,
      brand: 'GrowthMind',
      images: ['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80'],
      stock: 50,
      specs: { pages: 280, format: 'Paperback', topic: 'Self-Help' },
      tags: ['self-help', 'productivity', 'personal-growth'],
      ratings: { avg: 4.4, count: 234 },
      isFeatured: false,
      isActive: true
    },
    {
      name: 'Science Fiction Trilogy',
      slug: 'science-fiction-trilogy',
      description: 'Epic science fiction trilogy spanning galaxies, featuring advanced technology and alien civilizations.',
      price: 44.99,
      discountPrice: 34.99,
      category: books._id,
      brand: 'GalaxyPress',
      images: ['https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80'],
      stock: 25,
      specs: { books: 3, format: 'Paperback', genre: 'Science Fiction' },
      tags: ['scifi', 'fiction', 'trilogy'],
      ratings: { avg: 4.9, count: 412 },
      isFeatured: true,
      isActive: true
    }
  ];

  const createdProducts = await Product.insertMany(products);
  return createdProducts;
}

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is required');
  await mongoose.connect(uri);

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Coupon.deleteMany({}),
    Banner.deleteMany({}),
    Review.deleteMany({})
  ]);

  console.log('Seeding admin users...');
  const { admin, customer } = await seedAdminUser();

  console.log('Seeding categories...');
  const categories = await seedCategories();

  console.log('Seeding products...');
  const products = await seedProducts(categories);

  console.log('Seeding coupons...');
  await Coupon.create({ code: 'WELCOME10', type: 'percent', value: 10, minOrderValue: 20, expiryDate: new Date('2099-12-31'), usageLimit: 1000, usedCount: 0, isActive: true });
  await Coupon.create({ code: 'FLAT5', type: 'flat', value: 5, minOrderValue: 10, expiryDate: new Date('2099-12-31'), usageLimit: 500, usedCount: 0, isActive: true });

  console.log('Seeding banners...');
  await Banner.create({ title: 'Summer Sale', image: 'https://via.placeholder.com/1200x400/1a1a2e/ffffff?text=Summer+Sale', link: '/products?tag=summer', isActive: true, order: 1 });

  console.log('Seeding reviews...');
  await Review.create({ product: products[0]._id, user: customer._id, rating: 5, comment: 'Excellent product, exceeded my expectations!' });
  await Review.create({ product: products[1]._id, user: customer._id, rating: 4, comment: 'Great value for money, highly recommend.' });

  await mongoose.disconnect();
  console.log('Seed complete!');
  console.log(`Created ${products.length} products across 5 categories`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
