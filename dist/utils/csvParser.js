"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsvBuffer = parseCsvBuffer;
exports.enrichWithGeocode = enrichWithGeocode;
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
const zod_1 = require("zod");
const maps_service_1 = require("../services/maps.service");
const CsvRowSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional().default(''),
    type: zod_1.z.enum(['apartment', 'villa', 'plot', 'commercial', 'house']),
    price: zod_1.z.coerce.number().positive(),
    area: zod_1.z.coerce.number().positive(),
    street: zod_1.z.string().optional().default(''),
    city: zod_1.z.string().min(1),
    state: zod_1.z.string().optional().default(''),
    country: zod_1.z.string().min(1),
    amenities: zod_1.z.string().optional().default(''),
    images: zod_1.z.string().optional().default(''),
});
async function parseCsvBuffer(buffer) {
    const rows = await new Promise((resolve, reject) => {
        const results = [];
        stream_1.Readable.from(buffer)
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
    const inserted = [];
    const failed = [];
    for (let i = 0; i < rows.length; i++) {
        const parsed = CsvRowSchema.safeParse(rows[i]);
        if (!parsed.success) {
            failed.push({ row: i + 2, error: parsed.error.message });
            continue;
        }
        inserted.push(parsed.data);
    }
    return { inserted, failed };
}
async function enrichWithGeocode(rows) {
    return Promise.all(rows.map(async (row) => {
        const addressStr = [row.street, row.city, row.state, row.country]
            .filter(Boolean)
            .join(', ');
        try {
            const coords = await (0, maps_service_1.geocodeAddress)(addressStr);
            return { ...row, ...coords };
        }
        catch {
            return { ...row };
        }
    }));
}
//# sourceMappingURL=csvParser.js.map