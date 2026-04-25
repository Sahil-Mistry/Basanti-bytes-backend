"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCsv = uploadCsv;
const csvParser_1 = require("../utils/csvParser");
const property_model_1 = require("../models/property.model");
const response_1 = require("../utils/response");
const mongoose_1 = require("mongoose");
async function uploadCsv(req, res) {
    try {
        if (!req.user) {
            (0, response_1.sendError)(res, 'Unauthorized', 401);
            return;
        }
        if (!req.file) {
            (0, response_1.sendError)(res, 'No file uploaded', 400);
            return;
        }
        const user = req.user;
        const { inserted, failed } = await (0, csvParser_1.parseCsvBuffer)(req.file.buffer);
        if (inserted.length > 0) {
            const enriched = await (0, csvParser_1.enrichWithGeocode)(inserted);
            const docs = enriched.map((row) => ({
                title: row.title,
                description: row.description,
                type: row.type,
                price: row.price,
                area: row.area,
                address: {
                    street: row.street,
                    city: row.city,
                    state: row.state,
                    country: row.country,
                },
                location: row.lat && row.lng ? { type: 'Point', coordinates: [row.lng, row.lat] } : undefined,
                amenities: row.amenities ? row.amenities.split(',').map((a) => a.trim()) : [],
                images: row.images ? row.images.split(',').map((i) => i.trim()) : [],
                owner: new mongoose_1.Types.ObjectId(user.userId),
                isActive: true,
            }));
            await property_model_1.Property.insertMany(docs);
        }
        (0, response_1.sendSuccess)(res, { inserted: inserted.length, failed: failed.length, errors: failed }, 'CSV processed', 200);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        (0, response_1.sendError)(res, msg, 400);
    }
}
//# sourceMappingURL=upload.controller.js.map