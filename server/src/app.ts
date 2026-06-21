import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import xssClean from 'xss-clean';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import wishlistRoutes from './routes/wishlist';
import orderRoutes from './routes/orders';
import couponRoutes from './routes/coupons';
import bannerRoutes from './routes/banners';
import reviewRoutes from './routes/reviews';
import addressRoutes from './routes/addresses';
import adminRoutes from './routes/admin';
import debugRoutes from './routes/debug';
import errorHandler from './middleware/errorHandler';
import './db/connection';
import mongoSanitize from './middleware/sanitize';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(xssClean());
app.use(mongoSanitize);

const authLimiter = rateLimit({ windowMs: 60_000, max: 10, standardHeaders: true, legacyHeaders: false });
app.use('/api/v1/auth', authLimiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/admin', adminRoutes);
// debug seed endpoints (development only)
if (process.env.NODE_ENV !== 'production') app.use('/api/v1/debug', debugRoutes);

app.use(errorHandler);

export default app;
