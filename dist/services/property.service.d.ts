import { IProperty } from '../models/property.model';
import { PropertyFilters } from '../types/property.types';
export declare function createProperty(data: {
    title: string;
    description?: string;
    type: string;
    price: number;
    area: number;
    address: {
        street?: string;
        city: string;
        state?: string;
        country: string;
    };
    amenities?: string[];
    images?: string[];
}, ownerId: string): Promise<IProperty>;
export declare function getPropertyById(id: string): Promise<IProperty | null>;
export declare function searchProperties(filters: PropertyFilters): Promise<{
    data: IProperty[];
    total: number;
    page: number;
    limit: number;
}>;
export declare function updateProperty(id: string, userId: string, updates: Partial<IProperty>): Promise<IProperty | null>;
export declare function deleteProperty(id: string, userId: string): Promise<void>;
//# sourceMappingURL=property.service.d.ts.map