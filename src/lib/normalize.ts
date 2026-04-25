/**
 * lib/normalize.ts
 * Small math helpers reused across sub-score services.
 */

/**
 * Clamp a numeric value into [min, max].
 */
export function clamp(value: number, min = 0, max = 100): number {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear score interpolation. Returns 100 when value <= ideal,
 * 0 when value >= painful, and a linearly interpolated value
 * between those bounds otherwise.
 */
export function linearScore(value: number, ideal: number, painful: number): number {
  if (value <= ideal) return 100;
  if (value >= painful) return 0;
  const ratio = (painful - value) / (painful - ideal);
  return clamp(ratio * 100);
}
