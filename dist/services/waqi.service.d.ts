/**
 * services/waqi.service.ts
 * Air-quality sub-score from WAQI feed.
 */
export interface AQIScoreResult {
    score: number;
    value?: number;
    stationName?: string;
    source: string;
    error?: string;
}
export declare function getAQIScore(lat: number, lng: number): Promise<AQIScoreResult>;
//# sourceMappingURL=waqi.service.d.ts.map