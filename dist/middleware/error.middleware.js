"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const zod_1 = require("zod");
const jsonwebtoken_1 = require("jsonwebtoken");
const mongodb_1 = require("mongodb");
const response_1 = require("../utils/response");
function errorMiddleware(err, _req, res, _next) {
    console.error(err);
    if (err instanceof zod_1.ZodError) {
        const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        (0, response_1.sendError)(res, message, 422);
        return;
    }
    if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        (0, response_1.sendError)(res, 'Invalid token', 401);
        return;
    }
    if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
        const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
        (0, response_1.sendError)(res, `${field} already exists`, 409);
        return;
    }
    (0, response_1.sendError)(res, err.message ?? 'Internal server error', 500);
}
//# sourceMappingURL=error.middleware.js.map