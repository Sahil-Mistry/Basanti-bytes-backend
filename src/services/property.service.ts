import { Property, IProperty } from '../models/property.model';
import { PropertyFilters } from '../types/property.types';
import { Types } from 'mongoose';

export async function createProperty(
  data: {
    id: string;
    title: string;
    location: string;
    city: string;
    price: number;
    price_per_sqft: number;
    area_sqft: number;
    type: string;
    bedrooms: number;
    bathrooms: number;
    furnishing: string;
    age: number;
    latitude: number;
    longitude: number;
    investment_score: number;
    rental_yield: number;
    risk_level: string;
    location_coords: { type: string; coordinates: [number, number] };
  },
  ownerId?: string
): Promise<IProperty> {
  const property = new Property({
    ...data,
    owner: ownerId ? new Types.ObjectId(ownerId) : undefined,
  });

  return property.save();
}

export async function getPropertyById(id: string): Promise<IProperty | null> {
  return Property.findById(id).populate('owner', 'name email');
}

export async function searchProperties(filters: PropertyFilters): Promise<{
  data: IProperty[];
  total: number;
  page: number;
  limit: number;
}> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const skip = (page - 1) * limit;

  const query: Record<string, any> = { isActive: { $ne: false } };

  if (filters.city) query.city = { $regex: filters.city, $options: 'i' };
  if (filters.type) query.type = filters.type;
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
  }
  if (filters.minArea || filters.maxArea) {
    query.area_sqft = {};
    if (filters.minArea) query.area_sqft.$gte = filters.minArea;
    if (filters.maxArea) query.area_sqft.$lte = filters.maxArea;
  }

  if (filters.lat && filters.lng && filters.radius) {
    query.location_coords = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [filters.lng, filters.lat],
        },
        $maxDistance: filters.radius * 1000,
      },
    };
  }

  const sortBy = filters.sort ?? '-createdAt';
  const [data, total] = await Promise.all([
    Property.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate('owner', 'name email'),
    Property.countDocuments(query),
  ]);

  return { data, total, page, limit };
}

export async function updateProperty(
  id: string,
  userId: string,
  updates: Partial<IProperty>
): Promise<IProperty | null> {
  const property = await Property.findById(id);
  if (!property) return null;
  if (property.owner && property.owner.toString() !== userId) throw new Error('Unauthorized');

  Object.assign(property, updates);
  return property.save();
}

export async function deleteProperty(id: string, userId: string): Promise<void> {
  const property = await Property.findById(id);
  if (!property) throw new Error('Property not found');
  if (property.owner && property.owner.toString() !== userId) throw new Error('Unauthorized');

  property.isActive = false;
  await property.save();
}
