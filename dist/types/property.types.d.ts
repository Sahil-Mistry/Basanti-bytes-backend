export type PropertyType = 'apartment' | 'villa' | 'plot' | 'commercial' | 'house';
export interface PropertyAddress {
    street?: string;
    city: string;
    state?: string;
    country: string;
}
export interface GeoLocation {
    type: 'Point';
    coordinates: [number, number];
}
export interface PropertyFilters {
    city?: string;
    type?: PropertyType;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    lat?: number;
    lng?: number;
    radius?: number;
    page?: number;
    limit?: number;
    sort?: string;
}
//# sourceMappingURL=property.types.d.ts.map