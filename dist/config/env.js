"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function requireEnv(key) {
    const value = process.env[key];
    if (!value)
        throw new Error(`Missing required environment variable: ${key}`);
    return value;
}
exports.env = {
    PORT: parseInt(process.env.PORT ?? '3000', 10),
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    MONGODB_URI: requireEnv('MONGODB_URI'),
    JWT_ACCESS_SECRET: requireEnv('JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY ?? '',
};
//# sourceMappingURL=env.js.map