/**
 * db/mongo.ts
 * MongoDB database connection singleton
 */

import { MongoClient, Db } from 'mongodb';
import { env } from '../config/env';

let dbInstance: Db | null = null;
let clientInstance: MongoClient | null = null;

export async function initDb(): Promise<Db> {
  if (dbInstance) return dbInstance;

  clientInstance = new MongoClient(env.MONGODB_URI);
  await clientInstance.connect();
  dbInstance = clientInstance.db();
  console.log('MongoDB initialized');
  return dbInstance;
}

export function getDb(): Db {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return dbInstance;
}

export async function closeDb(): Promise<void> {
  if (clientInstance) {
    await clientInstance.close();
    dbInstance = null;
    clientInstance = null;
    console.log('MongoDB connection closed');
  }
}
