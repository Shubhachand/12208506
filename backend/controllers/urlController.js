// backend/controllers/shortenUrl.js

import Url from '../models/Urls.js';
import { generateShortUrl } from '../utils/generateShortUrl.js';

export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, shortCode } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    let finalShortCode = shortCode || generateShortUrl();

    const existing = await Url.findOne({ shortUrl: finalShortCode });
    if (existing) {
      return res.status(409).json({ error: 'Short code already exists. Please use a different one.' });
    }

    const expirationTime = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    const newUrl = new Url({
      originalUrl,
      shortUrl: finalShortCode,
      expiresAt: expirationTime,
    });

    await newUrl.save();

    res.status(201).json({
      shortUrl: `http://localhost:${process.env.PORT || 5000}/${finalShortCode}`,
      expiresAt: expirationTime.toISOString(), // ✅ ISO 8601 enforced
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


// controllers/urlController.js



export const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 }); // latest first

    const response = urls.map(url => ({
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      createdAt: url.createdAt.toISOString(),
      expiresAt: url.expiresAt.toISOString(),
      isActive: url.isActive,
      clicks: url.clicks
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


// controllers/redirectController.js

import geoip from 'geoip-lite';

export const redirectUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;

    const url = await Url.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

 
    if (url.expiresAt < new Date()) {
      return res.status(410).json({ error: 'This short link has expired.' });
    }

    
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '0.0.0.0';
    const geo = geoip.lookup(ip);
    const location = geo?.country || 'Unknown';

    const source = req.get('referer') || 'direct';

    // Update clicks and add entry to clickData
    url.clicks += 1;
    url.clickData.push({
      timestamp: new Date(),
      source,
      location,
    });

    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
