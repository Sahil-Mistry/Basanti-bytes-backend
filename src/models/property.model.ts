import mongoose, { Document, Schema, Types } from 'mongoose';
import { PropertyType, PropertyAddress, GeoLocation } from '../types/property.types';

export interface IProperty extends Document {
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  area: number;
  address: PropertyAddress;
  location?: GeoLocation;
  amenities: string[];
  images: string[];
  owner: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['apartment', 'villa', 'plot', 'commercial', 'house'],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    area: { type: Number, required: true, min: 0 },
    address: {
      street: { type: String },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
    },
    location: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] }, // [lng, lat]
    },
    amenities: [{ type: String }],
    images: [{ type: String }],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PropertySchema.index({ location: '2dsphere' });
PropertySchema.index({ 'address.city': 1 });
PropertySchema.index({ type: 1 });
PropertySchema.index({ price: 1 });

export const Property = mongoose.model<IProperty>('Property', PropertySchema);
