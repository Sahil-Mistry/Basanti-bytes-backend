/**
 * services/mediastack.service.ts
 * Safety sub-score from Mediastack news API.
 */
export interface SafetyScoreResult {
    score: number;
    articleCount?: number;
    negativeMatches?: number;
    source: string;
    error?: string;
}
export declare function getSafetyScore(localityName?: string): Promise<SafetyScoreResult>;
//# sourceMappingURL=mediastack.service.d.ts.map