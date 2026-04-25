/**
 * services/futureGrowth.service.ts (MongoDB version)
 * Future-growth sub-score from MongoDB collection of upcoming infrastructure.
 */
export interface FutureGrowthScoreResult {
    score: number;
    nearestFeature?: string;
    featureType?: string;
    expectedYear?: number;
    distanceKm?: number;
    source: string;
    error?: string;
}
export declare function getFutureGrowthScore(lat: number, lng: number): Promise<FutureGrowthScoreResult>;
//# sourceMappingURL=futureGrowth.service.d.ts.map