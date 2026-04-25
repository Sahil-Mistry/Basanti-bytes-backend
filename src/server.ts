import app from './app';
import { connectDB } from './config/db';

async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

export default app;