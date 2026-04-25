"use strict";
/**
 * db/mongo.ts
 * MongoDB database connection singleton
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = initDb;
exports.getDb = getDb;
exports.closeDb = closeDb;
const mongodb_1 = require("mongodb");
const env_1 = require("../config/env");
let dbInstance = null;
let clientInstance = null;
async function initDb() {
    if (dbInstance)
        return dbInstance;
    clientInstance = new mongodb_1.MongoClient(env_1.env.MONGODB_URI);
    await clientInstance.connect();
    dbInstance = clientInstance.db();
    console.log('MongoDB initialized');
    return dbInstance;
}
function getDb() {
    if (!dbInstance) {
        throw new Error('Database not initialized. Call initDb() first.');
    }
    return dbInstance;
}
async function closeDb() {
    if (clientInstance) {
        await clientInstance.close();
        dbInstance = null;
        clientInstance = null;
        console.log('MongoDB connection closed');
    }
}
//# sourceMappingURL=mongo.js.map