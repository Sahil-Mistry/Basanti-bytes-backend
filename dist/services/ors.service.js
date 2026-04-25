"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectivityScore = getConnectivityScore;
/**
 * services/ors.service.ts
 * --------------------------------------------------------------
 * Connectivity sub-score using OpenRouteService Matrix API.
 * One Matrix request fetches drive durations from the input
 * coordinate to four key Ahmedabad destinations. Each duration
 * is mapped to a 0-100 score with destination-specific
 * (ideal, painful) thresholds, then averaged.
 * --------------------------------------------------------------
 */
const axios_1 = __importDefault(require("axios"));
const normalize_1 = require("../lib/normalize");
const ORS_MATRIX_URL = 'https://api.openrouteservice.org/v2/matrix/driving-car';
// [lng, lat] pairs (ORS expects lon-first)
const DESTINATIONS = {
    airport: { coord: [72.6347, 23.0772], ideal: 20, painful: 75 },
    gift: { coord: [72.6822, 23.1614], ideal: 15, painful: 60 },
    railway: { coord: [72.5860, 23.07], ideal: 15, painful: 60 },
    sg_highway: { coord: [72.507, 23.025], ideal: 10, painful: 40 },
};
/**
 * Score connectivity from a coordinate to fixed Ahmedabad anchors.
 */
async function getConnectivityScore(lat, lng, city = 'Ahmedabad') {
    try {
        const token = process.env.ORS_TOKEN;
        if (!token) {
            return {
                score: 60,
                driveTimes: {},
                source: 'ORS (no token configured)',
                error: 'Missing ORS_TOKEN',
            };
        }
        const keys = Object.keys(DESTINATIONS);
        // Build locations: index 0 = source, indices 1..N = destinations
        const locations = [[lng, lat], ...keys.map((k) => DESTINATIONS[k].coord)];
        const body = {
            locations,
            sources: [0],
            destinations: keys.map((_, i) => i + 1),
            metrics: ['duration'],
        };
        const { data } = await axios_1.default.post(ORS_MATRIX_URL, body, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            timeout: 5000,
        });
        const durations = (data.durations && data.durations[0]) || [];
        const driveTimes = {};
        const partials = [];
        keys.forEach((key, idx) => {
            const seconds = durations[idx];
            if (seconds == null) {
                driveTimes[key] = null;
                partials.push(40); // moderate fallback if a leg is missing
                return;
            }
            const minutes = Math.round(seconds / 60);
            driveTimes[key] = minutes;
            const { ideal, painful } = DESTINATIONS[key];
            partials.push((0, normalize_1.linearScore)(minutes, ideal, painful));
        });
        const avg = partials.reduce((s, x) => s + x, 0) / (partials.length || 1);
        return {
            score: (0, normalize_1.clamp)(Math.round(avg)),
            driveTimes,
            city,
            source: 'OpenRouteService',
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.warn('[ors] failed:', message);
        return {
            score: 60,
            driveTimes: {},
            source: 'ORS (default after failure)',
            error: message,
        };
    }
}
//# sourceMappingURL=ors.service.js.map