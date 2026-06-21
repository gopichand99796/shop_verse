import { Review } from '../models/Review';
import { Product } from '../models/Product';

export async function createReview(payload: any) {
  // ensure one review per user per product
  const exists = await Review.findOne({ product: payload.product, user: payload.user });
  if (exists) throw new Error('User already reviewed this product');
  const review = await Review.create(payload);

  // update product ratings
  const agg = await Review.aggregate([{ $match: { product: review.product } }, { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } }]);
  if (agg && agg.length) {
    await Product.findByIdAndUpdate(review.product, { $set: { 'ratings.avg': agg[0].avg, 'ratings.count': agg[0].count } });
  }
  return review;
}

export async function listReviews(opts: { productId?: string | undefined; page?: number; limit?: number }) {
  const page = Math.max(1, opts.page || 1);
  const limit = Math.min(100, opts.limit || 20);
  const skip = (page - 1) * limit;
  const filter: any = {};
  if (opts.productId) filter.product = opts.productId;
  const items = await Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
  const total = await Review.countDocuments(filter).exec();
  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}
