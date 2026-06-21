import { Request, Response, NextFunction } from 'express';
import * as couponService from '../services/couponService';
import { success, error } from '../utils/response';

export async function applyCoupon(req: Request, res: Response, next: NextFunction) {
  try {
    const { code, subtotal } = req.body;
    const validated = await couponService.validateCoupon(code, subtotal || 0);
    if (!validated.valid) return error(res, 400, 'Invalid coupon', [{ reason: validated.reason }]);
    const discount = couponService.computeDiscount(validated.coupon, subtotal || 0);
    return success(res, 'Coupon valid', { coupon: validated.coupon, discount });
  } catch (err) { next(err); }
}

export async function listCoupons(_req: Request, res: Response, next: NextFunction) { try { const coupons = await (await import('../models/Coupon')).Coupon.find(); return success(res, 'Coupons', coupons); } catch (err) { next(err); } }
