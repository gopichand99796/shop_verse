import { Product } from '../models/Product';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

function sampleProducts() {
  const items: any[] = [];
  for (let i = 1; i <= 12; i++) items.push({ _id: `sample-${i}`, name: `Sample Product ${i}`, slug: `sample-product-${i}`, description: `Sample description ${i}`, price: 9.99 + i, stock: 100, isActive: true });
  return { items, total: items.length, page: 1, limit: items.length, pages: 1 };
}

export interface ListOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  ratingMin?: number;
  sort?: string;
  featured?: boolean;
  lowStock?: boolean;
}

export async function listProducts(opts: ListOptions = {}) {
  if (mongoose.connection.readyState !== 1) return sampleProducts();
  const page = Math.max(1, opts.page || 1);
  const limit = Math.min(100, opts.limit || 20);
  const skip = (page - 1) * limit;

  const filter: any = { isActive: true };
  if (opts.search) filter.$text = { $search: opts.search };
  if (opts.category) filter.category = new Types.ObjectId(opts.category);
  if (opts.brand) filter.brand = opts.brand;
  if (typeof opts.priceMin === 'number' || typeof opts.priceMax === 'number') {
    filter.price = {};
    if (typeof opts.priceMin === 'number') filter.price.$gte = opts.priceMin;
    if (typeof opts.priceMax === 'number') filter.price.$lte = opts.priceMax;
  }
  if (typeof opts.ratingMin === 'number') filter['ratings.avg'] = { $gte: opts.ratingMin };
  if (opts.featured) filter.isFeatured = true;
  if (opts.lowStock) filter.stock = { $lte: 5 };

  let sort: any = { createdAt: -1 };
  if (opts.sort === 'price_asc') sort = { price: 1 };
  else if (opts.sort === 'price_desc') sort = { price: -1 };
  else if (opts.sort === 'rating') sort = { 'ratings.avg': -1 };
  else if (opts.sort === 'popular') sort = { 'ratings.count': -1 };

  const q = Product.find(filter).sort(sort).skip(skip).limit(limit);
  if (opts.search) q.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });

  const [items, total] = await Promise.all([q.exec(), Product.countDocuments(filter).exec()]);
  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function getProductById(id: string) {
  if (mongoose.connection.readyState !== 1) {
    const items = sampleProducts().items; return items.find((it: any) => it._id === id) || null;
  }
  return Product.findById(id).exec();
}

export async function getProductBySlug(slug: string) {
  if (mongoose.connection.readyState !== 1) {
    const items = sampleProducts().items; return items.find((it: any) => it.slug === slug) || null;
  }
  return Product.findOne({ slug }).exec();
}

export async function featuredProducts(limit = 10) {
  return Product.find({ isFeatured: true, isActive: true }).limit(limit).sort({ createdAt: -1 }).exec();
}

export async function relatedProducts(productId: string, limit = 8) {
  const p = await Product.findById(productId).select('category').lean();
  if (!p) return [];
  return Product.find({ category: (p as any).category, _id: { $ne: productId }, isActive: true }).limit(limit).exec();
}

export async function lowStockProducts(limit = 50) {
  return Product.find({ stock: { $lte: 5 } }).limit(limit).sort({ stock: 1 }).exec();
}
