"use strict";
/**
 * lib/normalize.ts
 * Small math helpers reused across sub-score services.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = clamp;
exports.linearScore = linearScore;
/**
 * Clamp a numeric value into [min, max].
 */
function clamp(value, min = 0, max = 100) {
    if (Number.isNaN(value))
        return min;
    return Math.max(min, Math.min(max, value));
}
/**
 * Linear score interpolation. Returns 100 when value <= ideal,
 * 0 when value >= painful, and a linearly interpolated value
 * between those bounds otherwise.
 */
function linearScore(value, ideal, painful) {
    if (value <= ideal)
        return 100;
    if (value >= painful)
        return 0;
    const ratio = (painful - value) / (painful - ideal);
    return clamp(ratio * 100);
}
//# sourceMappingURL=normalize.js.map