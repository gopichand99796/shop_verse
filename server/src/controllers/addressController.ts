import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export async function addAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.addresses.push(req.body as any);
    await user.save();
    res.status(201).json({ success: true, data: user.addresses });
  } catch (err) { next(err); }
}

export async function listAddresses(req: Request, res: Response, next: NextFunction) {
  try { const userId = (req as any).user?.id; if (!userId) return res.status(401).json({ message: 'Unauthorized' }); const user = await User.findById(userId); res.json({ success: true, data: user?.addresses || [] }); } catch (err) { next(err); }
}
