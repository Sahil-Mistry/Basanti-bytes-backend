export type PropertyType = 'apartment' | 'villa' | 'plot' | 'commercial' | 'house' | 'Builder Floor';

export type FurnishingType = 'Unfurnished' | 'Semi-Furnished' | 'Furnished';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface GeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
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
  radius?: number; // km
  page?: number;
  limit?: number;
  sort?: string;
}