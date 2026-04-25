"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAmenityScore = getAmenityScore;
/**
 * services/geoapify.service.ts
 * --------------------------------------------------------------
 * Amenity sub-score using Geoapify Places. We query a fixed set of
 * useful POI categories within a 2 km radius, count occurrences per
 * category (capped to avoid runaway scoring), and combine into a
 * weighted 0-100 score.
 * --------------------------------------------------------------
 */
const axios_1 = __importDefault(require("axios"));
const normalize_1 = require("../lib/normalize");
const GEOAPIFY_PLACES = 'https://api.geoapify.com/v2/places';
const CATEGORIES = [
    'education.school',
    'healthcare.hospital',
    'healthcare.pharmacy',
    'commercial.supermarket',
    'commercial.shopping_mall',
    'leisure.park',
    'service.financial.bank',
    'public_transport.subway',
    'public_transport.train',
];
// (weight, cap) tuples for each abstract category bucket
const WEIGHTS = {
    school: { weight: 8, cap: 5 },
    hospital: { weight: 10, cap: 5 },
    pharmacy: { weight: 3, cap: 5 },
    supermarket: { weight: 5, cap: 5 },
    shopping_mall: { weight: 4, cap: 3 },
    park: { weight: 6, cap: 5 },
    bank: { weight: 3, cap: 5 },
    transit: { weight: 15, cap: 3 }, // subway + train collapsed
};
/**
 * Map the Geoapify category strings on a feature into our local buckets.
 * A single feature may belong to multiple categories — we increment
 * each bucket once per feature.
 */
function bucketize(categoriesArray) {
    const buckets = new Set();
    for (const c of categoriesArray || []) {
        if (c.includes('education.school'))
            buckets.add('school');
        else if (c.includes('healthcare.hospital'))
            buckets.add('hospital');
        else if (c.includes('healthcare.pharmacy'))
            buckets.add('pharmacy');
        else if (c.includes('commercial.supermarket'))
            buckets.add('supermarket');
        else if (c.includes('commercial.shopping_mall'))
            buckets.add('shopping_mall');
        else if (c.includes('leisure.park'))
            buckets.add('park');
        else if (c.includes('service.financial.bank') || c === 'service.financial' || c.includes('bank'))
            buckets.add('bank');
        else if (c.includes('public_transport.subway') || c.includes('public_transport.train'))
            buckets.add('transit');
    }
    return buckets;
}
/**
 * Fetch nearby amenities for the given coordinates and produce a
 * weighted amenity score.
 */
async function getAmenityScore(lat, lng) {
    try {
        const key = process.env.GEOAPIFY_KEY;
        if (!key) {
            return {
                score: 50,
                counts: {},
                source: 'Geoapify (no key configured)',
                error: 'Missing GEOAPIFY_KEY',
            };
        }
        const params = {
            categories: CATEGORIES.join(','),
            filter: `circle:${lng},${lat},2000`,
            bias: `proximity:${lng},${lat}`,
            limit: 100,
            apiKey: key,
        };
        const { data } = await axios_1.default.get(GEOAPIFY_PLACES, { params, timeout: 5000 });
        const counts = {
            school: 0,
            hospital: 0,
            pharmacy: 0,
            supermarket: 0,
            shopping_mall: 0,
            park: 0,
            bank: 0,
            transit: 0,
        };
        for (const feature of data.features || []) {
            const props = feature.properties || {};
            const buckets = bucketize(props.categories);
            for (const b of buckets) {
                if (counts[b] !== undefined)
                    counts[b] += 1;
            }
        }
        let score = 0;
        for (const bucket of Object.keys(WEIGHTS)) {
            const countVal = counts[bucket] ?? 0;
            score += Math.min(countVal, WEIGHTS[bucket].cap) * WEIGHTS[bucket].weight;
        }
        score = (0, normalize_1.clamp)(score);
        return { score, counts, source: 'Geoapify' };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.warn('[geoapify] failed:', message);
        return {
            score: 50,
            counts: {},
            source: 'Geoapify (default after failure)',
            error: message,
        };
    }
}
//# sourceMappingURL=geoapify.service.js.map