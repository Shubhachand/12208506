// backend/config/db.js

import mongoose from 'mongoose';


export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: `);
  } catch (error) {
    console.log('MongoDB connection failed', error);
    process.exit(1);
  }
};
