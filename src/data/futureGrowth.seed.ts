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

export const futureGrowth: FutureGrowthSeed[] = [
  {
    name: 'Ahmedabad Metro Phase 2 - Gandhinagar Line',
    type: 'metro',
    expectedYear: 2027,
    city: 'Ahmedabad',
    location: { type: 'Point', coordinates: [72.566, 23.15] },
  },
  {
    name: 'Ahmedabad Metro - Thaltej Gam Station',
    type: 'metro',
    expectedYear: 2026,
    city: 'Ahmedabad',
    location: { type: 'Point', coordinates: [72.507, 23.054] },
  },
  {
    name: 'Ahmedabad Metro - Vastrapur Station',
    type: 'metro',
    expectedYear: 2025,
    city: 'Ahmedabad',
    location: { type: 'Point', coordinates: [72.526, 23.0395] },
  },
  {
    name: 'Ahmedabad Metro - APMC Bopal Extension',
    type: 'metro',
    expectedYear: 2027,
    city: 'Ahmedabad',
    location: { type: 'Point', coordinates: [72.4685, 23.0322] },
  },
  {
    name: 'GIFT City Expansion (Gandhinagar)',
    type: 'sez',
    expectedYear: 2027,
    city: 'Ahmedabad',
    location: { type: 'Point', coordinates: [72.6822, 23.1614] },
  },
  {
    name: 'Ahmedabad-Mumbai Bullet Train Sabarmati Hub',
    type: 'rail',
    expectedYear: 2028,
    city: 'Ahmedabad',
    location: { type: 'Point', coordinates: [72.586, 23.07] },
  },
  {
    name: 'SP Ring Road Phase 2 (West)',
    type: 'highway',
    expectedYear: 2026,
    city: 'Ahmedabad',
    location: { type: 'Point', coordinates: [72.45, 23.02] },
  },
  {
    name: 'Sardar Vallabhbhai Patel Airport - New Terminal',
    type: 'airport',
    expectedYear: 2027,
    city: 'Ahmedabad',
    location: { type: 'Point', coordinates: [72.6347, 23.0772] },
  },
  {
    name: 'Dholera Smart Industrial City Phase 1',
    type: 'sez',
    expectedYear: 2028,
    city: 'Ahmedabad',
    location: { type: 'Point', coordinates: [72.22, 22.24] },
  },
  {
    name: 'Nikol-Naroda IT Park',
    type: 'it_park',
    expectedYear: 2026,
    city: 'Ahmedabad',
    location: { type: 'Point', coordinates: [72.652, 23.0488] },
  },
];

export default futureGrowth;
