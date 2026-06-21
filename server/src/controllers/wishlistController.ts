import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export async function getWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId).populate('wishlist');
    res.json({ success: true, data: user?.wishlist || [] });
  } catch (err) { next(err); }
}

export async function toggleWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const { productId } = req.body;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const idx = user.wishlist.findIndex((w: any) => String(w) === productId);
    if (idx >= 0) user.wishlist.splice(idx, 1); else user.wishlist.push(productId as any);
    await user.save();
    res.json({ success: true, data: user.wishlist });
  } catch (err) { next(err); }
}
