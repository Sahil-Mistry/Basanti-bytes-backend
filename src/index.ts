import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';
import { connectDB } from '../src/config/db';

// Global flag to prevent multiple DB connection attempts
let dbConnected = false;

export default async (req: VercelRequest, res: VercelResponse) => {
  // Connect to database on first request
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (err) {
      console.error('Failed to connect to database:', err);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }

  // Use Express app to handle the request
  return app(req, res);
};