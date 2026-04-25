"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProperty = createProperty;
exports.getProperty = getProperty;
exports.searchProperties = searchProperties;
exports.updateProperty = updateProperty;
exports.deleteProperty = deleteProperty;
const propertyService = __importStar(require("../services/property.service"));
const response_1 = require("../utils/response");
async function createProperty(req, res) {
    try {
        if (!req.user) {
            (0, response_1.sendError)(res, 'Unauthorized', 401);
            return;
        }
        const property = await propertyService.createProperty(req.body, req.user.userId);
        (0, response_1.sendSuccess)(res, property, 'Property created', 201);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : 'Creation failed';
        (0, response_1.sendError)(res, msg, 400);
    }
}
async function getProperty(req, res) {
    try {
        const property = await propertyService.getPropertyById(req.params.id);
        if (!property) {
            (0, response_1.sendError)(res, 'Property not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, property);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to fetch property';
        (0, response_1.sendError)(res, msg, 400);
    }
}
async function searchProperties(req, res) {
    try {
        const filters = {
            city: req.query.city,
            type: req.query.type,
            minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            minArea: req.query.minArea ? Number(req.query.minArea) : undefined,
            maxArea: req.query.maxArea ? Number(req.query.maxArea) : undefined,
            lat: req.query.lat ? Number(req.query.lat) : undefined,
            lng: req.query.lng ? Number(req.query.lng) : undefined,
            radius: req.query.radius ? Number(req.query.radius) : undefined,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 20,
            sort: req.query.sort,
        };
        const result = await propertyService.searchProperties(filters);
        (0, response_1.sendSuccess)(res, result.data, 'Properties fetched', 200, {
            total: result.total,
            page: result.page,
            limit: result.limit,
            pages: Math.ceil(result.total / result.limit),
        });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : 'Search failed';
        (0, response_1.sendError)(res, msg, 400);
    }
}
async function updateProperty(req, res) {
    try {
        if (!req.user) {
            (0, response_1.sendError)(res, 'Unauthorized', 401);
            return;
        }
        const property = await propertyService.updateProperty(req.params.id, req.user.userId, req.body);
        if (!property) {
            (0, response_1.sendError)(res, 'Property not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, property);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : 'Update failed';
        (0, response_1.sendError)(res, msg, err instanceof Error && msg === 'Unauthorized' ? 403 : 400);
    }
}
async function deleteProperty(req, res) {
    try {
        if (!req.user) {
            (0, response_1.sendError)(res, 'Unauthorized', 401);
            return;
        }
        await propertyService.deleteProperty(req.params.id, req.user.userId);
        (0, response_1.sendSuccess)(res, null, 'Property deleted');
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : 'Deletion failed';
        (0, response_1.sendError)(res, msg, msg === 'Unauthorized' ? 403 : 400);
    }
}
//# sourceMappingURL=property.controller.js.map