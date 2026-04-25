/**
 * lib/aggregate.ts
 * Top-level orchestrator for LocalityScore computation.
 */
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
export declare function computeLocalityScore(params: LocalityScoreParams): Promise<LocalityScoreResponse>;
//# sourceMappingURL=aggregate.d.ts.map