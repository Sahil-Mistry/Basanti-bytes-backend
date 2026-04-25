import { Property, IProperty } from '../models/property.model';
import { PropertyFilters } from '../types/property.types';
import { geocodeAddress } from './maps.service';
import { Types } from 'mongoose';

export async function createProperty(
  data: {
    title: string;
    description?: string;
    type: string;
    price: number;
    area: number;
    address: { street?: string; city: string; state?: string; country: string };
    amenities?: string[];
    images?: string[];
  },
  ownerId: string
): Promise<IProperty> {
  const addressStr = [data.address.street, data.address.city, data.address.state, data.address.country]
    .filter(Boolean)
    .join(', ');

  let location;
  try {
    const coords = await geocodeAddress(addressStr);
    location = {
      type: 'Point' as const,
      coordinates: [coords.lng, coords.lat],
    };
  } catch (err) {
    console.warn(`Geocoding failed: ${err}`);
  }

  const property = new Property({
    ...data,
    owner: new Types.ObjectId(ownerId),
    location,
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

  const query: Record<string, any> = { isActive: true };

  if (filters.city) query['address.city'] = filters.city;
  if (filters.type) query.type = filters.type;
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
  }
  if (filters.minArea || filters.maxArea) {
    query.area = {};
    if (filters.minArea) query.area.$gte = filters.minArea;
    if (filters.maxArea) query.area.$lte = filters.maxArea;
  }

  if (filters.lat && filters.lng && filters.radius) {
    query.location = {
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
  if (property.owner.toString() !== userId) throw new Error('Unauthorized');

  if (updates.address) {
    const addressStr = [
      updates.address.street,
      updates.address.city,
      updates.address.state,
      updates.address.country,
    ]
      .filter(Boolean)
      .join(', ');
    try {
      const coords = await geocodeAddress(addressStr);
      updates.location = {
        type: 'Point' as const,
        coordinates: [coords.lng, coords.lat],
      };
    } catch (err) {
      console.warn(`Geocoding failed: ${err}`);
    }
  }

  Object.assign(property, updates);
  return property.save();
}

export async function deleteProperty(id: string, userId: string): Promise<void> {
  const property = await Property.findById(id);
  if (!property) throw new Error('Property not found');
  if (property.owner.toString() !== userId) throw new Error('Unauthorized');

  property.isActive = false;
  await property.save();
}
