/**
 * services/builder.service.ts
 * Builder-trust sub-score from the curated `builders` collection.
 */

import { ObjectId } from 'mongodb';
import { getDb } from '../db/mongo';

export interface BuilderTrustResult {
  score: number;
  name?: string;
  projectsDelivered?: number;
  complaintsCount?: number;
  avgDelayMonths?: number;
  source: string;
  error?: string;
}

/**
 * Resolve the trust score for the given builder.
 */
export async function getBuilderTrustScore(builderId?: string): Promise<BuilderTrustResult> {
  if (!builderId) {
    return { score: 60, source: 'Builder unknown' };
  }

  try {
    if (!ObjectId.isValid(builderId)) {
      return { score: 60, source: 'Builder unknown (invalid id)', error: 'Invalid ObjectId' };
    }

    const db = getDb();
    const builder = await db.collection('builders').findOne({ _id: new ObjectId(builderId) });

    if (!builder) {
      return { score: 60, source: 'Builder unknown (not found)' };
    }

    return {
      score: builder.trustScore ?? 60,
      name: builder.name,
      projectsDelivered: builder.projectsDelivered,
      complaintsCount: builder.complaintsCount,
      avgDelayMonths: builder.avgDelayMonths,
      source: 'Curated dataset (RERA-based)',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.warn('[builder] failed:', message);
    return { score: 60, source: 'Builder lookup failed', error: message };
  }
}
