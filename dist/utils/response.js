"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, message = 'Success', statusCode = 200, meta) {
    const body = { success: true, message, data };
    if (meta)
        body.meta = meta;
    res.status(statusCode).json(body);
}
function sendError(res, message, statusCode = 500, data) {
    const body = { success: false, message, data };
    res.status(statusCode).json(body);
}
//# sourceMappingURL=response.js.map