/**
 * services/futureGrowth.service.ts (MongoDB version)
 * Future-growth sub-score from MongoDB collection of upcoming infrastructure.
 */

import { getDb } from '../db/mongo';
import { clamp } from '../lib/normalize';

export interface FutureGrowthScoreResult {
  score: number;
  nearestFeature?: string;
  featureType?: string;
  expectedYear?: number;
  distanceKm?: number;
  source: string;
  error?: string;
}

export async function getFutureGrowthScore(lat: number, lng: number): Promise<FutureGrowthScoreResult> {
  try {
    const db = getDb();

    const results = await db
      .collection('futureGrowth')
      .aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [lng, lat] },
            distanceField: 'distanceMeters',
            maxDistance: 8000,
            spherical: true,
          },
        },
        { $limit: 1 },
      ])
      .toArray();

    if (!results.length) {
      return { score: 30, source: 'No upcoming infrastructure within 8 km' };
    }

    const nearest = results[0] as {
      name: string;
      type: string;
      expectedYear: number;
      distanceMeters: number;
    };
    const distance = nearest.distanceMeters;
    const score = clamp(Math.max(20, 100 - distance / 80));

    return {
      score: Math.round(score),
      nearestFeature: nearest.name,
      featureType: nearest.type,
      expectedYear: nearest.expectedYear,
      distanceKm: Number((distance / 1000).toFixed(2)),
      source: 'Curated dataset',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.warn('[futureGrowth] failed:', message);
    return { score: 50, source: 'FutureGrowth (default after failure)', error: message };
  }
}
