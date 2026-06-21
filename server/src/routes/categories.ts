import { Router } from 'express';
import { listCategories, createCategory, getCategory } from '../controllers/categoryController';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import mongoSanitize from '../middleware/sanitize';
import { createCategorySchema } from '../validators/category';

const router = Router();

router.get('/', listCategories);
router.post('/', requireAuth, requireRole('admin'), mongoSanitize, (req, res, next) => {
	try { createCategorySchema.parse(req.body); } catch (e) { return res.status(400).json({ message: 'Validation failed', errors: e }); }
	return createCategory(req, res, next);
});

router.get('/:id', getCategory);

export default router;
cc 