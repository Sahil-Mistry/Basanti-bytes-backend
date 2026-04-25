/**
 * services/geoapify.service.ts
 * --------------------------------------------------------------
 * Amenity sub-score using Geoapify Places. We query a fixed set of
 * useful POI categories within a 2 km radius, count occurrences per
 * category (capped to avoid runaway scoring), and combine into a
 * weighted 0-100 score.
 * --------------------------------------------------------------
 */
import axios from 'axios';
import { clamp } from '../lib/normalize';

const GEOAPIFY_PLACES = 'https://api.geoapify.com/v2/places';

const CATEGORIES = [
  'education.school',
  'healthcare.hospital',
  'healthcare.pharmacy',
  'commercial.supermarket',
  'commercial.shopping_mall',
  'leisure.park',
  'service.financial.bank',
  'public_transport.subway',
  'public_transport.train',
];

// (weight, cap) tuples for each abstract category bucket
const WEIGHTS: Record<string, { weight: number; cap: number }> = {
  school: { weight: 8, cap: 5 },
  hospital: { weight: 10, cap: 5 },
  pharmacy: { weight: 3, cap: 5 },
  supermarket: { weight: 5, cap: 5 },
  shopping_mall: { weight: 4, cap: 3 },
  park: { weight: 6, cap: 5 },
  bank: { weight: 3, cap: 5 },
  transit: { weight: 15, cap: 3 }, // subway + train collapsed
};

export interface AmenityCounts {
  school: number;
  hospital: number;
  pharmacy: number;
  supermarket: number;
  shopping_mall: number;
  park: number;
  bank: number;
  transit: number;
}

export interface AmenityScoreResult {
  score: number;
  counts: Partial<AmenityCounts>;
  source: string;
  error?: string;
}

/**
 * Map the Geoapify category strings on a feature into our local buckets.
 * A single feature may belong to multiple categories — we increment
 * each bucket once per feature.
 */
function bucketize(categoriesArray: string[] | undefined): Set<keyof AmenityCounts> {
  const buckets = new Set<keyof AmenityCounts>();
  for (const c of categoriesArray || []) {
    if (c.includes('education.school')) buckets.add('school');
    else if (c.includes('healthcare.hospital')) buckets.add('hospital');
    else if (c.includes('healthcare.pharmacy')) buckets.add('pharmacy');
    else if (c.includes('commercial.supermarket')) buckets.add('supermarket');
    else if (c.includes('commercial.shopping_mall')) buckets.add('shopping_mall');
    else if (c.includes('leisure.park')) buckets.add('park');
    else if (c.includes('service.financial.bank') || c === 'service.financial' || c.includes('bank'))
      buckets.add('bank');
    else if (c.includes('public_transport.subway') || c.includes('public_transport.train')) buckets.add('transit');
  }
  return buckets;
}

/**
 * Fetch nearby amenities for the given coordinates and produce a
 * weighted amenity score.
 */
export async function getAmenityScore(lat: number, lng: number): Promise<AmenityScoreResult> {
  try {
    const key = process.env.GEOAPIFY_KEY;
    if (!key) {
      return {
        score: 50,
        counts: {},
        source: 'Geoapify (no key configured)',
        error: 'Missing GEOAPIFY_KEY',
      };
    }

    const params = {
      categories: CATEGORIES.join(','),
      filter: `circle:${lng},${lat},2000`,
      bias: `proximity:${lng},${lat}`,
      limit: 100,
      apiKey: key,
    };

    const { data } = await axios.get(GEOAPIFY_PLACES, { params, timeout: 5000 });

    const counts: AmenityCounts = {
      school: 0,
      hospital: 0,
      pharmacy: 0,
      supermarket: 0,
      shopping_mall: 0,
      park: 0,
      bank: 0,
      transit: 0,
    };

    for (const feature of data.features || []) {
      const props = feature.properties || {};
      const buckets = bucketize(props.categories);
      for (const b of buckets) {
        if (counts[b] !== undefined) counts[b] += 1;
      }
    }

    let score = 0;
    for (const bucket of Object.keys(WEIGHTS)) {
      const countVal = counts[bucket as keyof AmenityCounts] ?? 0;
      score += Math.min(countVal, WEIGHTS[bucket].cap) * WEIGHTS[bucket].weight;
    }
    score = clamp(score);

    return { score, counts, source: 'Geoapify' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.warn('[geoapify] failed:', message);
    return {
      score: 50,
      counts: {},
      source: 'Geoapify (default after failure)',
      error: message,
    };
  }
}
