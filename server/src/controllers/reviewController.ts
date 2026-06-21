import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/reviewService';
import { success, error } from '../utils/response';

export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return error(res, 401, 'Unauthorized');
    const payload = { ...req.body, user: userId };
    const r = await reviewService.createReview(payload);
    return success(res, 'Review created', r);
  } catch (err: any) { return next(err); }
}

export async function listReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId, page, limit } = req.query as any;
    const p = productId || undefined;
    const result = await reviewService.listReviews({ productId: p, page: Number(page) || 1, limit: Number(limit) || 20 });
    return success(res, 'Reviews', result);
  } catch (err) { next(err); }
}
