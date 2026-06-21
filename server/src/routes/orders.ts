import { Router } from 'express';
import { createOrder, listOrders, adminListOrders, adminUpdateStatus } from '../controllers/orderController';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { createOrderSchema } from '../validators/order';
import mongoSanitize from '../middleware/sanitize';

const router = Router();

router.post('/', requireAuth, mongoSanitize, (req, res, next) => { try { createOrderSchema.parse(req.body); } catch (e) { return res.status(400).json({ success: false, message: 'Validation failed', errors: e }); } return createOrder(req, res, next); });

router.get('/', requireAuth, listOrders);

router.get('/admin', requireAuth, requireRole('admin'), adminListOrders);
router.patch('/admin/:id/status', requireAuth, requireRole('admin'), mongoSanitize, adminUpdateStatus);

export default router;
