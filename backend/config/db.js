// backend/config/db.js

import mongoose from 'mongoose';
import { logger } from '../.././loggingMiddleware/logger.js'; // adjust path if needed

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.fatal('MongoDB connection failed', error.stack);
    process.exit(1);
  }
};
