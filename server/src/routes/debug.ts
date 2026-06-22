import { Router } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import mongoose from 'mongoose';

const router = Router();

router.get('/seed-products', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) return res.json({ success: true, message: 'Already seeded', count });

    // Get or create a default category
    let category = await Category.findOne({ name: 'General' });
    if (!category) {
      category = await Category.create({ name: 'General', slug: 'general', description: 'General category' });
    }

    const samples: any[] = [];
    for (let i = 1; i <= 12; i++) {
      samples.push({
        name: `Sample Product ${i}`,
        slug: `sample-product-${i}`,
        description: `Description for product ${i}`,
        price: 9.99 + i,
        category: category._id,
        brand: 'Sample Brand',
        images: [],
        stock: 100,
        specs: {},
        tags: [],
        ratings: { avg: 0, count: 0 },
        isFeatured: false,
        isActive: true
      });
    }
    const docs = await Product.insertMany(samples);
    return res.json({ success: true, message: 'Seeded', count: docs.length });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Seed failed', error: err?.message || String(err) });
  }
});

export default router;
