"use strict";
/**
 * services/waqi.service.ts
 * Air-quality sub-score from WAQI feed.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAQIScore = getAQIScore;
const axios_1 = __importDefault(require("axios"));
const normalize_1 = require("../lib/normalize");
const WAQI_BASE = 'https://api.waqi.info/feed';
function aqiToScore(aqi) {
    if (aqi <= 50)
        return 100;
    if (aqi <= 100)
        return 60;
    if (aqi <= 150)
        return 50;
    if (aqi <= 200)
        return 30;
    if (aqi <= 300)
        return 10;
    return 0;
}
async function getAQIScore(lat, lng) {
    try {
        const token = process.env.WAQI_TOKEN;
        if (!token) {
            return { score: 60, source: 'WAQI (no token configured)', error: 'Missing WAQI_TOKEN' };
        }
        const url = `${WAQI_BASE}/geo:${lat};${lng}/?token=${token}`;
        const { data } = await axios_1.default.get(url, { timeout: 5000 });
        if (data.status !== 'ok' || !data.data || typeof data.data.aqi !== 'number') {
            return { score: 60, source: 'WAQI (default — no station nearby)', error: 'WAQI returned no data' };
        }
        const aqi = data.data.aqi;
        const score = (0, normalize_1.clamp)(aqiToScore(aqi));
        return {
            score,
            value: aqi,
            stationName: data.data.city?.name,
            source: 'WAQI',
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.warn('[waqi] failed:', message);
        return { score: 60, source: 'WAQI (default after failure)', error: message };
    }
}
//# sourceMappingURL=waqi.service.js.map