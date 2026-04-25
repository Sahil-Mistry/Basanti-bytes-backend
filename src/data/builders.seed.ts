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

export const builders: BuilderSeed[] = [
  {
    name: 'Sun Builders Group',
    reraIds: ['PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA00123/2018'],
    projectsDelivered: 45,
    avgDelayMonths: 3,
    complaintsCount: 5,
    trustScore: 86,
    city: 'Ahmedabad',
    establishedYear: 1979,
  },
  {
    name: 'Deep Builders',
    reraIds: ['PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA00214/2019'],
    projectsDelivered: 22,
    avgDelayMonths: 5,
    complaintsCount: 7,
    trustScore: 74,
    city: 'Ahmedabad',
    establishedYear: 1995,
  },
  {
    name: 'Swara Group',
    reraIds: ['PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA00305/2019'],
    projectsDelivered: 18,
    avgDelayMonths: 4,
    complaintsCount: 6,
    trustScore: 72,
    city: 'Ahmedabad',
    establishedYear: 2001,
  },
  {
    name: 'Swagat Group',
    reraIds: ['PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA00412/2018'],
    projectsDelivered: 30,
    avgDelayMonths: 4,
    complaintsCount: 5,
    trustScore: 80,
    city: 'Ahmedabad',
    establishedYear: 1990,
  },
  {
    name: 'Vishwanath Builders',
    reraIds: ['PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA00528/2018'],
    projectsDelivered: 28,
    avgDelayMonths: 3,
    complaintsCount: 4,
    trustScore: 84,
    city: 'Ahmedabad',
    establishedYear: 1989,
  },
  {
    name: 'Adani Realty',
    reraIds: ['PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA00611/2020'],
    projectsDelivered: 35,
    avgDelayMonths: 2,
    complaintsCount: 3,
    trustScore: 90,
    city: 'Ahmedabad',
    establishedYear: 2010,
  },
  {
    name: 'Goyal & Co.',
    reraIds: ['PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA00722/2018'],
    projectsDelivered: 40,
    avgDelayMonths: 3,
    complaintsCount: 4,
    trustScore: 87,
    city: 'Ahmedabad',
    establishedYear: 1971,
  },
  {
    name: 'Savvy Infrastructure',
    reraIds: ['PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA00834/2019'],
    projectsDelivered: 24,
    avgDelayMonths: 6,
    complaintsCount: 9,
    trustScore: 70,
    city: 'Ahmedabad',
    establishedYear: 1996,
  },
  {
    name: 'Shivalik Group',
    reraIds: ['PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA00945/2018'],
    projectsDelivered: 26,
    avgDelayMonths: 4,
    complaintsCount: 6,
    trustScore: 78,
    city: 'Ahmedabad',
    establishedYear: 1998,
  },
  {
    name: 'Pacifica Companies',
    reraIds: ['PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA01057/2019'],
    projectsDelivered: 20,
    avgDelayMonths: 5,
    complaintsCount: 7,
    trustScore: 73,
    city: 'Ahmedabad',
    establishedYear: 2003,
  },
];

export default builders;
