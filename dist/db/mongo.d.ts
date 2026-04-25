/**
 * db/mongo.ts
 * MongoDB database connection singleton
 */
import { Db } from 'mongodb';
export declare function initDb(): Promise<Db>;
export declare function getDb(): Db;
export declare function closeDb(): Promise<void>;
//# sourceMappingURL=mongo.d.ts.map