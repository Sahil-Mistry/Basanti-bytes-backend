"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
const builders_seed_1 = require("./data/builders.seed");
const futureGrowth_seed_1 = require("./data/futureGrowth.seed");
dotenv_1.default.config();
async function seed() {
    const client = new mongodb_1.MongoClient(process.env.MONGO_URI ?? 'mongodb://localhost:27017');
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();
    // Drop and re-insert builders
    await db.collection('builders').deleteMany({});
    const buildersResult = await db.collection('builders').insertMany(builders_seed_1.builders);
    console.log(`Inserted ${buildersResult.insertedCount} builders`);
    // Drop and re-insert futureGrowth
    await db.collection('futureGrowth').deleteMany({});
    const fgResult = await db.collection('futureGrowth').insertMany(futureGrowth_seed_1.futureGrowth);
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
//# sourceMappingURL=seed.js.map