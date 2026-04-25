import mongoose, { Document, Schema, Types } from 'mongoose';
import { PropertyType, FurnishingType, RiskLevel, GeoLocation } from '../types/property.types';

export interface IProperty extends Document {
  id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  price_per_sqft: number;
  area_sqft: number;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  furnishing: FurnishingType;
  age: number;
  latitude: number;
  longitude: number;
  investment_score: number;
  rental_yield: number;
  risk_level: RiskLevel;
  location_coords: GeoLocation;
  owner?: Types.ObjectId;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    id: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    city: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    price_per_sqft: { type: Number, required: true, min: 0 },
    area_sqft: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ['apartment', 'villa', 'plot', 'commercial', 'house', 'Builder Floor'],
      required: true,
      index: true,
    },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    furnishing: {
      type: String,
      enum: ['Unfurnished', 'Semi-Furnished', 'Furnished'],
      required: true,
    },
    age: { type: Number, required: true, min: 0 },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    investment_score: { type: Number, required: true, min: 0, max: 100 },
    rental_yield: { type: Number, required: true, min: 0 },
    risk_level: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
    },
    location_coords: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: [Number], // [lng, lat]
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PropertySchema.index({ location_coords: '2dsphere' });
PropertySchema.index({ price: 1 });

export const Property = mongoose.model<IProperty>('Property', PropertySchema);