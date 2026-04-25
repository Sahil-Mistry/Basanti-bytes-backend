export interface DriveTimes {
    [key: string]: number | null;
}
export interface ConnectivityScoreResult {
    score: number;
    driveTimes: DriveTimes;
    city?: string;
    source: string;
    error?: string;
}
/**
 * Score connectivity from a coordinate to fixed Ahmedabad anchors.
 */
export declare function getConnectivityScore(lat: number, lng: number, city?: string): Promise<ConnectivityScoreResult>;
//# sourceMappingURL=ors.service.d.ts.map