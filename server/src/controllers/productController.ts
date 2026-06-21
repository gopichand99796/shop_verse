import { Request, Response, NextFunction } from 'express';
import { CreateProductInput } from '../validators/product';
import * as productService from '../services/productService';
import { success, error } from '../utils/response';

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as CreateProductInput;
    const product = await (await import('../models/Product')).Product.create(data as any);
    return success(res, 'Product created', product);
  } catch (err) { return next(err); }
}

export async function listProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const q = req.query as any;
    const opts = {
      page: q.page ? Number(q.page) : undefined,
      limit: q.limit ? Number(q.limit) : undefined,
      search: q.search,
      category: q.category,
      brand: q.brand,
      priceMin: q.priceMin ? Number(q.priceMin) : undefined,
      priceMax: q.priceMax ? Number(q.priceMax) : undefined,
      ratingMin: q.ratingMin ? Number(q.ratingMin) : undefined,
      sort: q.sort,
      featured: q.featured === '1',
      lowStock: q.lowStock === '1'
    };
    const result = await productService.listProducts(opts);
    return success(res, 'Products listed', result);
  } catch (err) { return next(err); }
}

export async function getProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const p = await productService.getProductById(id);
    if (!p) return error(res, 404, 'Not found');
    return success(res, 'Product', p);
  } catch (err) { return next(err); }
}

export async function getProductBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const p = await productService.getProductBySlug(slug);
    if (!p) return error(res, 404, 'Not found');
    return success(res, 'Product', p);
  } catch (err) { return next(err); }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const upd = await (await import('../models/Product')).Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!upd) return error(res, 404, 'Not found');
    return success(res, 'Updated', upd);
  } catch (err) { return next(err); }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await (await import('../models/Product')).Product.findByIdAndDelete(id);
    return success(res, 'Deleted');
  } catch (err) { return next(err); }
}

export async function featured(req: Request, res: Response, next: NextFunction) {
  try { const items = await productService.featuredProducts(); return success(res, 'Featured', items); } catch (err) { next(err); }
}

export async function related(req: Request, res: Response, next: NextFunction) {
  try { const { id } = req.params; const items = await productService.relatedProducts(id); return success(res, 'Related', items); } catch (err) { next(err); }
}

export async function lowStock(req: Request, res: Response, next: NextFunction) {
  try { const items = await productService.lowStockProducts(); return success(res, 'Low stock', items); } catch (err) { next(err); }
}
