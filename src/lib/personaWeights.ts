/**
 * lib/personaWeights.ts
 * Persona-specific weight vectors used by the aggregator. Each row MUST sum to 1.0.
 */

export interface PersonaWeights {
  safety: number;
  aqi: number;
  amenity: number;
  connectivity: number;
  futureGrowth: number;
  builder: number;
}

export const personaWeights: Record<string, PersonaWeights> = {
  family: {
    safety: 0.25,
    aqi: 0.2,
    amenity: 0.2,
    connectivity: 0.15,
    futureGrowth: 0.1,
    builder: 0.1,
  },
  investor: {
    safety: 0.15,
    aqi: 0.1,
    amenity: 0.1,
    connectivity: 0.2,
    futureGrowth: 0.3,
    builder: 0.15,
  },
  senior: {
    safety: 0.2,
    aqi: 0.3,
    amenity: 0.25,
    connectivity: 0.1,
    futureGrowth: 0.05,
    builder: 0.1,
  },
};

export default personaWeights;
