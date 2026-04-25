/**
 * data/builders.seed.ts
 * Curated list of Ahmedabad builders loaded into MongoDB by seed script.
 */
export interface BuilderSeed {
    name: string;
    reraIds: string[];
    projectsDelivered: number;
    avgDelayMonths: number;
    complaintsCount: number;
    trustScore: number;
    city: string;
    establishedYear: number;
}
export declare const builders: BuilderSeed[];
export default builders;
//# sourceMappingURL=builders.seed.d.ts.map