import { Coupon } from '../models/Coupon';

export async function validateCoupon(code: string, subtotal: number) {
  const c = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!c) return { valid: false, reason: 'not_found' };
  if (c.expiryDate < new Date()) return { valid: false, reason: 'expired' };
  if (c.usageLimit <= c.usedCount) return { valid: false, reason: 'usage_limit' };
  if (subtotal < c.minOrderValue) return { valid: false, reason: 'min_order' };
  return { valid: true, coupon: c };
}

export function computeDiscount(coupon: any, subtotal: number) {
  if (!coupon) return 0;
  if (coupon.type === 'percent') return (subtotal * (coupon.value / 100));
  return coupon.value;
}

export async function incrementUsage(couponId: any) {
  return Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
}
