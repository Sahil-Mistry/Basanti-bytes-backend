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
 * Fetch nearby amenities for the given coordinates and produce a
 * weighted amenity score.
 */
export declare function getAmenityScore(lat: number, lng: number): Promise<AmenityScoreResult>;
//# sourceMappingURL=geoapify.service.d.ts.map