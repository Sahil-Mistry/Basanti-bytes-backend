import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { builders } from './data/builders.seed';
import { futureGrowth } from './data/futureGrowth.seed';

dotenv.config();

async function seed(): Promise<void> {
  const client = new MongoClient(process.env.MONGO_URI ?? 'mongodb://localhost:27017');
  await client.connect();
  console.log('Connected to MongoDB');

  const db = client.db();

  // Drop and re-insert builders
  await db.collection('builders').deleteMany({});
  const buildersResult = await db.collection('builders').insertMany(builders);
  console.log(`Inserted ${buildersResult.insertedCount} builders`);

  // Drop and re-insert futureGrowth
  await db.collection('futureGrowth').deleteMany({});
  const fgResult = await db.collection('futureGrowth').insertMany(futureGrowth);
  console.log(`Inserted ${fgResult.insertedCount} futureGrowth features`);

  // Create 2dsphere index for geo queries
  await db.collection('futureGrowth').createIndex({ location: '2dsphere' });
  console.log('Created 2dsphere index on futureGrowth.location');

  await client.close();
  console.log('Seed complete');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
