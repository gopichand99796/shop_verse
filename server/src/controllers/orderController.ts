import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/orderService';
import { success, error } from '../utils/response';

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return error(res, 401, 'Unauthorized');
    const payload = req.body;
    const order = await orderService.createOrderFromCart(userId, payload);
    return success(res, 'Order created', order);
  } catch (err: any) { return next(err); }
}

export async function listOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return error(res, 401, 'Unauthorized');
    const orders = await orderService.listOrdersForUser(userId);
    return success(res, 'Orders', orders);
  } catch (err) { return next(err); }
}

export async function adminListOrders(req: Request, res: Response, next: NextFunction) {
  try { const items = await orderService.adminListOrders(); return success(res, 'All orders', items); } catch (err) { next(err); }
}

export async function adminUpdateStatus(req: Request, res: Response, next: NextFunction) {
  try { const { id } = req.params; const { status } = req.body; const updated = await orderService.updateOrderStatus(id, status); return success(res, 'Updated', updated); } catch (err) { next(err); }
}
