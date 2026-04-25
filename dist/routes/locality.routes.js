"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * routes/locality.routes.ts
 */
const express_1 = require("express");
const aggregate_1 = require("../lib/aggregate");
const router = (0, express_1.Router)();
/**
 * GET /api/locality/score
 * Query params:
 *   - lat        (required) latitude as float
 *   - lng        (required) longitude as float
 *   - persona    (optional) 'family' | 'investor' | 'senior' (default: 'family')
 *   - builderId  (optional) MongoDB ObjectId of the builder
 *   - locality   (optional) human-readable locality name (used for GDELT query)
 */
router.get('/score', async (req, res) => {
    try {
        const { lat, lng, persona, builderId, locality } = req.query;
        const latNum = parseFloat(lat ?? '');
        const lngNum = parseFloat(lng ?? '');
        if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
            res.status(400).json({
                error: 'Invalid query: lat and lng must be valid numbers',
                example: '/api/locality/score?lat=23.0395&lng=72.5260&persona=family',
            });
            return;
        }
        if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
            res.status(400).json({
                error: 'lat must be in [-90,90] and lng must be in [-180,180]',
            });
            return;
        }
        const result = await (0, aggregate_1.computeLocalityScore)({
            lat: latNum,
            lng: lngNum,
            persona,
            builderId,
            locality,
        });
        res.json(result);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Internal server error';
        console.error('Error computing locality score:', err);
        res.status(500).json({ error: message });
    }
});
exports.default = router;
//# sourceMappingURL=locality.routes.js.map