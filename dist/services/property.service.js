"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProperty = createProperty;
exports.getPropertyById = getPropertyById;
exports.searchProperties = searchProperties;
exports.updateProperty = updateProperty;
exports.deleteProperty = deleteProperty;
const property_model_1 = require("../models/property.model");
const maps_service_1 = require("./maps.service");
const mongoose_1 = require("mongoose");
async function createProperty(data, ownerId) {
    const addressStr = [data.address.street, data.address.city, data.address.state, data.address.country]
        .filter(Boolean)
        .join(', ');
    let location;
    try {
        const coords = await (0, maps_service_1.geocodeAddress)(addressStr);
        location = {
            type: 'Point',
            coordinates: [coords.lng, coords.lat],
        };
    }
    catch (err) {
        console.warn(`Geocoding failed: ${err}`);
    }
    const property = new property_model_1.Property({
        ...data,
        owner: new mongoose_1.Types.ObjectId(ownerId),
        location,
    });
    return property.save();
}
async function getPropertyById(id) {
    return property_model_1.Property.findById(id).populate('owner', 'name email');
}
async function searchProperties(filters) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;
    const query = { isActive: true };
    if (filters.city)
        query['address.city'] = filters.city;
    if (filters.type)
        query.type = filters.type;
    if (filters.minPrice || filters.maxPrice) {
        query.price = {};
        if (filters.minPrice)
            query.price.$gte = filters.minPrice;
        if (filters.maxPrice)
            query.price.$lte = filters.maxPrice;
    }
    if (filters.minArea || filters.maxArea) {
        query.area = {};
        if (filters.minArea)
            query.area.$gte = filters.minArea;
        if (filters.maxArea)
            query.area.$lte = filters.maxArea;
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
        property_model_1.Property.find(query)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .populate('owner', 'name email'),
        property_model_1.Property.countDocuments(query),
    ]);
    return { data, total, page, limit };
}
async function updateProperty(id, userId, updates) {
    const property = await property_model_1.Property.findById(id);
    if (!property)
        return null;
    if (property.owner.toString() !== userId)
        throw new Error('Unauthorized');
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
            const coords = await (0, maps_service_1.geocodeAddress)(addressStr);
            updates.location = {
                type: 'Point',
                coordinates: [coords.lng, coords.lat],
            };
        }
        catch (err) {
            console.warn(`Geocoding failed: ${err}`);
        }
    }
    Object.assign(property, updates);
    return property.save();
}
async function deleteProperty(id, userId) {
    const property = await property_model_1.Property.findById(id);
    if (!property)
        throw new Error('Property not found');
    if (property.owner.toString() !== userId)
        throw new Error('Unauthorized');
    property.isActive = false;
    await property.save();
}
//# sourceMappingURL=property.service.js.map