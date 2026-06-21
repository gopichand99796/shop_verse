import mongoose from 'mongoose';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import * as couponService from './couponService';

export async function createOrderFromCart(userId: string, payload: any) {
  const session = mongoose.connection.readyState ? await mongoose.startSession() : null;
  try {
    if (session) session.startTransaction();
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) throw new Error('Cart empty');

    // validate stock
    for (const item of cart.items) {
      const p: any = item.product;
      if (p.stock < item.qty) throw new Error(`Insufficient stock for ${p._id}`);
    }

    // compute totals
    let subtotal = 0;
    for (const item of cart.items) subtotal += item.qty * (item.priceAtAdd || (item.product as any).price || 0);

    let discount = 0;
    if (payload.coupon) {
      const validated = await couponService.validateCoupon(payload.coupon, subtotal);
      if (!validated.valid) throw new Error('Invalid coupon');
      // validated.coupon exists when valid
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      discount = couponService.computeDiscount(validated.coupon!, subtotal);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await couponService.incrementUsage(validated.coupon!._id);
    }

    const total = subtotal - discount;

    // decrement stock atomically
    for (const item of cart.items) {
      await Product.updateOne({ _id: item.product._id, stock: { $gte: item.qty } }, { $inc: { stock: -item.qty } }, { session });
    }

    const order = await Order.create([{ user: userId, items: cart.items.map((i: any) => ({ product: i.product._id, qty: i.qty, priceAtAdd: i.priceAtAdd || i.product.price })), shippingAddress: payload.shippingAddress, paymentStatus: payload.paymentStatus || 'pending', orderStatus: 'placed', coupon: payload.coupon || null, subtotal, discount, total }], { session });

    // clear cart
    cart.items = [];
    await cart.save({ session });

    if (session) await session.commitTransaction();
    return order[0];
  } catch (err) {
    if (session) await session.abortTransaction();
    throw err;
  } finally {
    if (session) session.endSession();
  }
}

export async function listOrdersForUser(userId: string) {
  return Order.find({ user: userId }).sort({ createdAt: -1 }).limit(200).exec();
}

export async function adminListOrders() {
  return Order.find().sort({ createdAt: -1 }).limit(500).exec();
}

export async function updateOrderStatus(orderId: string, status: string) {
  return Order.findByIdAndUpdate(orderId, { $set: { orderStatus: status }, $push: { statusHistory: { status, timestamp: new Date() } } }, { new: true }).exec();
}
