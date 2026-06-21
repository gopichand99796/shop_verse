import { Router } from 'express';
import { applyCoupon, listCoupons } from '../controllers/couponController';
import mongoSanitize from '../middleware/sanitize';
import { applyCouponSchema } from '../validators/coupon';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', listCoupons);
router.post('/apply', requireAuth, mongoSanitize, (req, res, next) => {
	try { applyCouponSchema.parse(req.body); } catch (e) { return res.status(400).json({ message: 'Validation failed', errors: e }); }
	return applyCoupon(req, res, next);
});

export default router;
