import { Request, Response, NextFunction } from 'express';
import { Banner } from '../models/Banner';

export async function listBanners(_req: Request, res: Response, next: NextFunction) {
  try { const b = await Banner.find({ isActive: true }).sort({ order: 1 }); res.json({ success: true, data: b }); } catch (err) { next(err); }
}
