/**
 * lib/aggregate.ts
 * Top-level orchestrator for LocalityScore computation.
 */

import personaWeights from './personaWeights';
import { getAQIScore } from '../services/waqi.service';
import { getSafetyScore } from '../services/mediastack.service';
import { getAmenityScore } from '../services/geoapify.service';
import { getConnectivityScore } from '../services/ors.service';
import { getFutureGrowthScore } from '../services/futureGrowth.service';
import { getBuilderTrustScore } from '../services/builder.service';

export interface LocalityScoreParams {
  lat: number;
  lng: number;
  persona?: string;
  builderId?: string;
  locality?: string;
}

export interface SubScores {
  safety: number;
  aqi: number;
  amenity: number;
  connectivity: number;
  futureGrowth: number;
  builder: number;
}

export interface LocalityScoreResponse {
  score: number;
  persona: string;
  subScores: SubScores;
  sources: Record<string, unknown>;
  weights: Record<string, number>;
  input: Record<string, unknown>;
  computedAt: string;
}

/**
 * Compute the composite LocalityScore by aggregating all sub-scores.
 */
export async function computeLocalityScore(params: LocalityScoreParams): Promise<LocalityScoreResponse> {
  // Resolve persona, falling back to 'family' if missing or unknown
  const personaKey = personaWeights[params.persona ?? 'investor'] ? params.persona ?? 'investor' : 'family';
  const weights = personaWeights[personaKey];

  // Fan out — all six sub-scores in parallel
  const [aqiResult, safetyResult, amenityResult, connectivityResult, futureGrowthResult, builderResult] =
    await Promise.all([
      getAQIScore(params.lat, params.lng),
      getSafetyScore(params.locality),
      getAmenityScore(params.lat, params.lng),
      getConnectivityScore(params.lat, params.lng),
      getFutureGrowthScore(params.lat, params.lng),
      getBuilderTrustScore(params.builderId),
    ]);

  const subScores: SubScores = {
    safety: safetyResult.score,
    aqi: aqiResult.score,
    amenity: amenityResult.score,
    connectivity: connectivityResult.score,
    futureGrowth: futureGrowthResult.score,
    builder: builderResult.score,
  };

  const composite =
    weights.safety * subScores.safety +
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
    weights: weights as unknown as Record<string, number>,
    input: { lat: params.lat, lng: params.lng, builderId: params.builderId ?? null, locality: params.locality ?? null },
    computedAt: new Date().toISOString(),
  };
}
