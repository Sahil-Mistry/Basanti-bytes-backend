"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../utils/jwt");
async function register(name, email, password, role = 'investor') {
    const existing = await user_model_1.User.findOne({ email });
    if (existing)
        throw new Error('Email already registered');
    const user = new user_model_1.User({ name, email, passwordHash: password, role });
    await user.save();
    const payload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    };
    return {
        user,
        tokens: {
            accessToken: (0, jwt_1.signAccessToken)(payload),
            refreshToken: (0, jwt_1.signRefreshToken)(payload),
        },
    };
}
async function login(email, password) {
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        throw new Error('Invalid credentials');
    const valid = await user.comparePassword(password);
    if (!valid)
        throw new Error('Invalid credentials');
    const payload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    };
    return {
        accessToken: (0, jwt_1.signAccessToken)(payload),
        refreshToken: (0, jwt_1.signRefreshToken)(payload),
    };
}
//# sourceMappingURL=auth.service.js.map