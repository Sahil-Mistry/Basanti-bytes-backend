"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = verifyJWT;
exports.requireRole = requireRole;
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
function verifyJWT() {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            (0, response_1.sendError)(res, 'No token provided', 401);
            return;
        }
        const token = authHeader.split(' ')[1];
        try {
            req.user = (0, jwt_1.verifyAccessToken)(token);
            next();
        }
        catch {
            (0, response_1.sendError)(res, 'Invalid or expired token', 401);
        }
    };
}
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            (0, response_1.sendError)(res, 'Forbidden', 403);
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map