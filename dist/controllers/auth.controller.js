"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        const { user, tokens } = await (0, auth_service_1.register)(name, email, password);
        (0, response_1.sendSuccess)(res, { user, ...tokens }, 'Registered successfully', 201);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : 'Registration failed';
        (0, response_1.sendError)(res, msg, 400);
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const tokens = await (0, auth_service_1.login)(email, password);
        (0, response_1.sendSuccess)(res, tokens, 'Login successful');
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : 'Login failed';
        (0, response_1.sendError)(res, msg, 401);
    }
}
//# sourceMappingURL=auth.controller.js.map