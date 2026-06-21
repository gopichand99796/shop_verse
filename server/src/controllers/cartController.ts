import { Request, Response, NextFunction } from 'express';
import { Cart } from '../models/Cart';
import { AddToCartInput } from '../validators/cart';
import mongoose from 'mongoose';

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    res.json({ success: true, data: cart || { items: [] } });
  } catch (err) { next(err); }
}

export async function addToCart(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as AddToCartInput;
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const uid = new mongoose.Types.ObjectId(userId);
    let cart = await Cart.findOne({ user: uid });
    if (!cart) cart = await Cart.create({ user: uid, items: [] } as any);
    const exists = cart.items.find((i: any) => String(i.product) === input.productId);
    if (exists) exists.qty += input.qty; else cart.items.push({ product: input.productId, qty: input.qty, priceAtAdd: 0 } as any);
    await cart.save();
    res.json({ success: true, data: cart });
  } catch (err) { next(err); }
}

export async function removeFromCart(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId } = req.params;
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter((i: any) => String(i.product) !== productId);
    await cart.save();
    res.json({ success: true, data: cart });
  } catch (err) { next(err); }
}
