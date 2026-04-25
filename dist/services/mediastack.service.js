"use strict";
/**
 * services/mediastack.service.ts
 * Safety sub-score from Mediastack news API.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafetyScore = getSafetyScore;
const axios_1 = __importDefault(require("axios"));
const normalize_1 = require("../lib/normalize");
const MEDIASTACK_URL = 'http://api.mediastack.com/v1/news';
const NEGATIVE_KEYWORDS = [
    'crime',
    'theft',
    'robbery',
    'assault',
    'murder',
    'rape',
    'arrest',
    'attack',
    'violence',
    'accident',
    'death',
    'killed',
    'injured',
    'fraud',
    'molestation',
    'kidnap',
    'gang',
    'shooting',
];
async function getSafetyScore(localityName) {
    if (!localityName || typeof localityName !== 'string' || !localityName.trim()) {
        return { score: 70, source: 'Mediastack (default - no locality)' };
    }
    const apiKey = process.env.MEDIASTACK_KEY;
    if (!apiKey) {
        return {
            score: 70,
            source: 'Mediastack (default)',
            error: 'Missing MEDIASTACK_KEY',
        };
    }
    try {
        const params = {
            access_key: apiKey,
            keywords: `${localityName.trim()},crime`,
            countries: 'in',
            languages: 'en',
            limit: 25,
            sort: 'published_desc',
        };
        const { data } = await axios_1.default.get(MEDIASTACK_URL, { params, timeout: 5000 });
        if (data && data.error) {
            return {
                score: 70,
                source: 'Mediastack (default after error)',
                error: data.error.message || data.error.code || 'Unknown Mediastack error',
            };
        }
        const articles = data?.data || [];
        const count = articles.length;
        const negativeMatches = articles.reduce((sum, a) => {
            const text = `${a.title || ''} ${a.description || ''}`.toLowerCase();
            const hits = NEGATIVE_KEYWORDS.filter((k) => text.includes(k)).length;
            return sum + hits;
        }, 0);
        let score = 75;
        score -= Math.min(count * 1, 25);
        score -= Math.min(negativeMatches * 0.5, 15);
        return {
            score: (0, normalize_1.clamp)(Math.round(score)),
            articleCount: count,
            negativeMatches,
            source: 'Mediastack',
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.warn('[mediastack] failed:', message);
        return {
            score: 70,
            source: 'Mediastack (default after failure)',
            error: message,
        };
    }
}
//# sourceMappingURL=mediastack.service.js.map