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
export declare const personaWeights: Record<string, PersonaWeights>;
export default personaWeights;
//# sourceMappingURL=personaWeights.d.ts.map