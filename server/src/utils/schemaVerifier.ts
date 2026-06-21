import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Cart } from '../models/Cart';
import { Order } from '../models/Order';
import { Coupon } from '../models/Coupon';
import { Banner } from '../models/Banner';
import { Review } from '../models/Review';

dotenv.config();

async function verify() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is required');

  await mongoose.connect(uri);

  const collections = [
    { name: 'users', model: User },
    { name: 'products', model: Product },
    { name: 'categories', model: Category },
    { name: 'carts', model: Cart },
    { name: 'orders', model: Order },
    { name: 'coupons', model: Coupon },
    { name: 'banners', model: Banner },
    { name: 'reviews', model: Review }
  ];

  for (const collection of collections) {
    const indexes = await collection.model.collection.indexes();
    console.log(`Indexes for ${collection.name}:`, indexes);
  }

  await mongoose.disconnect();
}

verify().catch((error) => {
  console.error(error);
  process.exit(1);
});
