"use strict";
/**
 * services/builder.service.ts
 * Builder-trust sub-score from the curated `builders` collection.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuilderTrustScore = getBuilderTrustScore;
const mongodb_1 = require("mongodb");
const mongo_1 = require("../db/mongo");
/**
 * Resolve the trust score for the given builder.
 */
async function getBuilderTrustScore(builderId) {
    if (!builderId) {
        return { score: 60, source: 'Builder unknown' };
    }
    try {
        if (!mongodb_1.ObjectId.isValid(builderId)) {
            return { score: 60, source: 'Builder unknown (invalid id)', error: 'Invalid ObjectId' };
        }
        const db = (0, mongo_1.getDb)();
        const builder = await db.collection('builders').findOne({ _id: new mongodb_1.ObjectId(builderId) });
        if (!builder) {
            return { score: 60, source: 'Builder unknown (not found)' };
        }
        return {
            score: builder.trustScore ?? 60,
            name: builder.name,
            projectsDelivered: builder.projectsDelivered,
            complaintsCount: builder.complaintsCount,
            avgDelayMonths: builder.avgDelayMonths,
            source: 'Curated dataset (RERA-based)',
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.warn('[builder] failed:', message);
        return { score: 60, source: 'Builder lookup failed', error: message };
    }
}
//# sourceMappingURL=builder.service.js.map