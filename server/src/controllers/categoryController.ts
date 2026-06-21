import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import { CreateCategoryInput } from '../validators/category';

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as CreateCategoryInput;
    const c = await Category.create(data as any);
    res.status(201).json({ success: true, data: c });
  } catch (err) { next(err); }
}

export async function listCategories(_req: Request, res: Response, next: NextFunction) {
  try { const cats = await Category.find(); res.json({ success: true, data: cats }); } catch (err) { next(err); }
}

export async function getCategory(req: Request, res: Response, next: NextFunction) { try { const c = await Category.findById(req.params.id); if (!c) return res.status(404).json({ message: 'Not found' }); res.json({ success: true, data: c }); } catch (err) { next(err); } }
