import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const uri = process.env.MONGO_URI;

async function connect(uriToUse: string) {
  await mongoose.connect(uriToUse);
  console.log('MongoDB connected to', uriToUse);
}

(async () => {
  if (!uri) {
    console.warn('MONGO_URI not provided — starting in-memory MongoDB for development');
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGO_URI is required in production');
    }
    const memoryServer = await MongoMemoryServer.create();
    await connect(memoryServer.getUri());
    return;
  }

  try {
    await connect(uri);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to in-memory MongoDB for local development');
      const memoryServer = await MongoMemoryServer.create();
      await connect(memoryServer.getUri());
      return;
    }
    process.exit(1);
  }
})();
