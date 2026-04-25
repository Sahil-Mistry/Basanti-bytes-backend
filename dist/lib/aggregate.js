"use strict";
/**
 * lib/aggregate.ts
 * Top-level orchestrator for LocalityScore computation.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeLocalityScore = computeLocalityScore;
const personaWeights_1 = __importDefault(require("./personaWeights"));
const waqi_service_1 = require("../services/waqi.service");
const mediastack_service_1 = require("../services/mediastack.service");
const geoapify_service_1 = require("../services/geoapify.service");
const ors_service_1 = require("../services/ors.service");
const futureGrowth_service_1 = require("../services/futureGrowth.service");
const builder_service_1 = require("../services/builder.service");
/**
 * Compute the composite LocalityScore by aggregating all sub-scores.
 */
async function computeLocalityScore(params) {
    // Resolve persona, falling back to 'family' if missing or unknown
    const personaKey = personaWeights_1.default[params.persona ?? 'family'] ? params.persona ?? 'family' : 'family';
    const weights = personaWeights_1.default[personaKey];
    // Fan out — all six sub-scores in parallel
    const [aqiResult, safetyResult, amenityResult, connectivityResult, futureGrowthResult, builderResult] = await Promise.all([
        (0, waqi_service_1.getAQIScore)(params.lat, params.lng),
        (0, mediastack_service_1.getSafetyScore)(params.locality),
        (0, geoapify_service_1.getAmenityScore)(params.lat, params.lng),
        (0, ors_service_1.getConnectivityScore)(params.lat, params.lng),
        (0, futureGrowth_service_1.getFutureGrowthScore)(params.lat, params.lng),
        (0, builder_service_1.getBuilderTrustScore)(params.builderId),
    ]);
    const subScores = {
        safety: safetyResult.score,
        aqi: aqiResult.score,
        amenity: amenityResult.score,
        connectivity: connectivityResult.score,
        futureGrowth: futureGrowthResult.score,
        builder: builderResult.score,
    };
    const composite = weights.safety * subScores.safety +
        weights.aqi * subScores.aqi +
        weights.amenity * subScores.amenity +
        weights.connectivity * subScores.connectivity +
        weights.futureGrowth * subScores.futureGrowth +
        weights.builder * subScores.builder;
    return {
        score: Math.round(composite),
        persona: personaKey,
        subScores,
        sources: {
            safety: safetyResult,
            aqi: aqiResult,
            amenity: amenityResult,
            connectivity: connectivityResult,
            futureGrowth: futureGrowthResult,
            builder: builderResult,
        },
        weights: weights,
        input: { lat: params.lat, lng: params.lng, builderId: params.builderId ?? null, locality: params.locality ?? null },
        computedAt: new Date().toISOString(),
    };
}
//# sourceMappingURL=aggregate.js.map