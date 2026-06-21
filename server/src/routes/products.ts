import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import mongoSanitize from '../middleware/sanitize';
import * as ctrl from '../controllers/productController';
import { createProductSchema } from '../validators/product';
import { productListQuery } from '../validators/productQuery';

const router = Router();

router.get('/', (req, res, next) => {
	try { productListQuery.parse(req.query); } catch (e) { return res.status(400).json({ success: false, message: 'Invalid query', errors: e }); }
	return ctrl.listProducts(req, res, next);
});

router.get('/featured', ctrl.featured);
router.get('/related/:id', ctrl.related);
router.get('/slug/:slug', ctrl.getProductBySlug);
router.get('/low-stock', requireAuth, requireRole('admin'), ctrl.lowStock);

router.post('/', requireAuth, requireRole('admin'), mongoSanitize, (req, res, next) => {
	try { createProductSchema.parse(req.body); } catch (err) { return res.status(400).json({ success: false, message: 'Validation failed', errors: err }); }
	return ctrl.createProduct(req, res, next);
});

router.get('/:id', ctrl.getProduct);
router.patch('/:id', requireAuth, requireRole('admin'), mongoSanitize, ctrl.updateProduct);
router.delete('/:id', requireAuth, requireRole('admin'), ctrl.deleteProduct);

export default router;
