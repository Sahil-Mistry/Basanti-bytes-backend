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
exports.Property = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PropertySchema = new mongoose_1.Schema({
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
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
PropertySchema.index({ location: '2dsphere' });
PropertySchema.index({ 'address.city': 1 });
PropertySchema.index({ type: 1 });
PropertySchema.index({ price: 1 });
exports.Property = mongoose_1.default.model('Property', PropertySchema);
//# sourceMappingURL=property.model.js.map