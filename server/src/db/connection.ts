import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.warn('MONGO_URI not provided — skipping automatic MongoDB connection (dev mode)');
} else {
  mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}
