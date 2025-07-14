import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import shorturls from './routes/urlRoutes.js'
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use("/",shorturls)
connectDB();


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 