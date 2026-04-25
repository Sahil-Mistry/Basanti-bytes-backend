/**
 * lib/normalize.ts
 * Small math helpers reused across sub-score services.
 */
/**
 * Clamp a numeric value into [min, max].
 */
export declare function clamp(value: number, min?: number, max?: number): number;
/**
 * Linear score interpolation. Returns 100 when value <= ideal,
 * 0 when value >= painful, and a linearly interpolated value
 * between those bounds otherwise.
 */
export declare function linearScore(value: number, ideal: number, painful: number): number;
//# sourceMappingURL=normalize.d.ts.map