"use strict";
/**
 * lib/personaWeights.ts
 * Persona-specific weight vectors used by the aggregator. Each row MUST sum to 1.0.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.personaWeights = void 0;
exports.personaWeights = {
    family: {
        safety: 0.25,
        aqi: 0.25,
        amenity: 0.2,
        connectivity: 0.1,
        futureGrowth: 0.1,
        builder: 0.1,
    },
    investor: {
        safety: 0.1,
        aqi: 0.1,
        amenity: 0.1,
        connectivity: 0.2,
        futureGrowth: 0.3,
        builder: 0.2,
    },
    senior: {
        safety: 0.25,
        aqi: 0.3,
        amenity: 0.2,
        connectivity: 0.1,
        futureGrowth: 0.05,
        builder: 0.1,
    },
};
exports.default = exports.personaWeights;
//# sourceMappingURL=personaWeights.js.map