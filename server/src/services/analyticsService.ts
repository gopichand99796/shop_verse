import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { User } from '../models/User';

export async function revenueOverTime(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const agg = await Order.aggregate([
    { $match: { createdAt: { $gte: since }, paymentStatus: 'paid' } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]).exec();
  return agg;
}

export async function salesByCategory() {
  const agg = await Order.aggregate([
    { $unwind: '$items' },
    { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'prod' } },
    { $unwind: '$prod' },
    { $group: { _id: '$prod.category', sales: { $sum: '$items.qty' }, revenue: { $sum: { $multiply: ['$items.qty', '$items.priceAtAdd'] } } } },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
    { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
    { $project: { _id: 0, category: '$category.name', sales: 1, revenue: 1 } }
  ]).exec();
  return agg;
}

export async function topSellingProducts(limit = 10) {
  const agg = await Order.aggregate([
    { $unwind: '$items' },
    { $group: { _id: '$items.product', sold: { $sum: '$items.qty' } } },
    { $sort: { sold: -1 } },
    { $limit: limit },
    { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $project: { _id: 0, product: '$product', sold: 1 } }
  ]).exec();
  return agg;
}

export async function customerSignups(days = 30) {
  const since = new Date(); since.setDate(since.getDate() - days);
  const agg = await User.aggregate([{ $match: { createdAt: { $gte: since } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]);
  return agg;
}

export async function averageOrderValue() {
  const agg = await Order.aggregate([{ $group: { _id: null, avg: { $avg: '$total' } } }]);
  return agg[0] || { avg: 0 };
}

export async function conversionRate() {
  // Approximate: orders / users
  const orders = await Order.countDocuments();
  const users = await User.countDocuments();
  return { orders, users, conversion: users ? orders / users : 0 };
}
