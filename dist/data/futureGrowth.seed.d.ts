/**
 * data/futureGrowth.seed.ts
 * GeoJSON-style records of upcoming infrastructure around Ahmedabad.
 */
export interface FutureGrowthSeed {
    name: string;
    type: 'metro' | 'sez' | 'rail' | 'highway' | 'airport' | 'it_park';
    expectedYear: number;
    city: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
}
export declare const futureGrowth: FutureGrowthSeed[];
export default futureGrowth;
//# sourceMappingURL=futureGrowth.seed.d.ts.map