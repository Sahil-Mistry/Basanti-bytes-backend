"use strict";
/**
 * services/futureGrowth.service.ts (MongoDB version)
 * Future-growth sub-score from MongoDB collection of upcoming infrastructure.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFutureGrowthScore = getFutureGrowthScore;
const mongo_1 = require("../db/mongo");
const normalize_1 = require("../lib/normalize");
async function getFutureGrowthScore(lat, lng) {
    try {
        const db = (0, mongo_1.getDb)();
        const results = await db
            .collection('futureGrowth')
            .aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [lng, lat] },
                    distanceField: 'distanceMeters',
                    maxDistance: 8000,
                    spherical: true,
                },
            },
            { $limit: 1 },
        ])
            .toArray();
        if (!results.length) {
            return { score: 30, source: 'No upcoming infrastructure within 8 km' };
        }
        const nearest = results[0];
        const distance = nearest.distanceMeters;
        const score = (0, normalize_1.clamp)(Math.max(20, 100 - distance / 80));
        return {
            score: Math.round(score),
            nearestFeature: nearest.name,
            featureType: nearest.type,
            expectedYear: nearest.expectedYear,
            distanceKm: Number((distance / 1000).toFixed(2)),
            source: 'Curated dataset',
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.warn('[futureGrowth] failed:', message);
        return { score: 50, source: 'FutureGrowth (default after failure)', error: message };
    }
}
//# sourceMappingURL=futureGrowth.service.js.map