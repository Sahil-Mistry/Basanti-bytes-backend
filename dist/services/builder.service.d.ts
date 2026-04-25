/**
 * services/builder.service.ts
 * Builder-trust sub-score from the curated `builders` collection.
 */
export interface BuilderTrustResult {
    score: number;
    name?: string;
    projectsDelivered?: number;
    complaintsCount?: number;
    avgDelayMonths?: number;
    source: string;
    error?: string;
}
/**
 * Resolve the trust score for the given builder.
 */
export declare function getBuilderTrustScore(builderId?: string): Promise<BuilderTrustResult>;
//# sourceMappingURL=builder.service.d.ts.map