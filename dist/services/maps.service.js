"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocodeAddress = geocodeAddress;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
async function geocodeAddress(address) {
    if (!env_1.env.GOOGLE_MAPS_API_KEY) {
        console.warn('Google Maps API key not configured, skipping geocoding');
        throw new Error('Google Maps API key not configured');
    }
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const response = await axios_1.default.get(url, {
        params: {
            address,
            key: env_1.env.GOOGLE_MAPS_API_KEY,
        },
    });
    if (response.data.status !== 'OK' || !response.data.results.length) {
        throw new Error(`Geocoding failed for address: ${address}`);
    }
    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
}
//# sourceMappingURL=maps.service.js.map