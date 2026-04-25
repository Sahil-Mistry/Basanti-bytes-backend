import axios from 'axios';
import { env } from '../config/env';

interface GeocodingResult {
  lat: number;
  lng: number;
}

export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  if (!env.GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not configured, skipping geocoding');
    throw new Error('Google Maps API key not configured');
  }

  const url = 'https://maps.googleapis.com/maps/api/geocode/json';
  const response = await axios.get(url, {
    params: {
      address,
      key: env.GOOGLE_MAPS_API_KEY,
    },
  });

  if (response.data.status !== 'OK' || !response.data.results.length) {
    throw new Error(`Geocoding failed for address: ${address}`);
  }

  const { lat, lng } = response.data.results[0].geometry.location;
  return { lat, lng };
}
