import { Router } from 'express';
import { Product } from '../models/Product';

const router = Router();

router.get('/seed-products', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) return res.json({ success: true, message: 'Already seeded', count });
    const samples = [];
    for (let i = 1; i <= 12; i++) {
      samples.push({ name: `Sample Product ${i}`, slug: `sample-product-${i}`, description: `Description for product ${i}`, price: 9.99 + i, stock: 100, isActive: true });
    }
    const docs = await Product.insertMany(samples);
    return res.json({ success: true, message: 'Seeded', count: docs.length });
  } catch (err) { return res.status(500).json({ success: false, message: 'Seed failed', error: err }); }
});

export default router;
