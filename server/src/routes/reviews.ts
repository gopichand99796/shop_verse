import { Router } from 'express';
import { createReview, listReviews } from '../controllers/reviewController';
import { requireAuth } from '../middleware/auth';
import mongoSanitize from '../middleware/sanitize';
import { z } from 'zod';

const router = Router();

router.get('/', listReviews);
router.post('/', requireAuth, mongoSanitize, createReview);

export default router;
