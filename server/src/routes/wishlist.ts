import { Router } from 'express';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController';
import { requireAuth } from '../middleware/auth';
import mongoSanitize from '../middleware/sanitize';

const router = Router();

router.get('/', requireAuth, getWishlist);
router.post('/', requireAuth, mongoSanitize, toggleWishlist);

export default router;
