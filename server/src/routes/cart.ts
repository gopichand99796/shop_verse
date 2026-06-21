import { Router } from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController';
import { requireAuth } from '../middleware/auth';
import mongoSanitize from '../middleware/sanitize';
import { addToCartSchema } from '../validators/cart';

const router = Router();

router.get('/', requireAuth, getCart);
router.post('/', requireAuth, mongoSanitize, (req, res, next) => {
	try { addToCartSchema.parse(req.body); } catch (e) { return res.status(400).json({ message: 'Validation failed', errors: e }); }
	return addToCart(req, res, next);
});

router.delete('/:productId', requireAuth, removeFromCart);

export default router;
