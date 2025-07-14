// models/Url.js

import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  source: { type: String },       // e.g., referer or "direct"
  location: { type: String },     // e.g., country or city
});

const urlSchema = new mongoose.Schema(
  {
    originalUrl: { 
      type: String, 
      required: true 
    },
    shortUrl: { 
      type: String, 
      required: true, 
      unique: true 
    },
    clicks: { 
      type: Number, 
      default: 0 
    },
    isActive: {
      type: Boolean,
      default: true
    },
    expiresAt: {                  
      type: Date,
      required: true
    },
    clickData: [clickSchema]    
  },
  {
    timestamps: true              
  }
);

export default mongoose.model('Url', urlSchema);
