import mongoose, { Document, Types } from 'mongoose';
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
export declare const Property: mongoose.Model<IProperty, {}, {}, {}, mongoose.Document<unknown, {}, IProperty, {}, {}> & IProperty & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=property.model.d.ts.map