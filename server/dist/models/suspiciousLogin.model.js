"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suspiciousLoginSchema = void 0;
const zod_1 = require("zod");
// Schema for Context
const suspiciousLoginSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    user: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    ip: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    os: zod_1.z.string().optional(),
    device: zod_1.z.string().optional(),
    deviceType: zod_1.z.string().optional(),
    unverifiedAttempts: zod_1.z.number().int().default(0),
    isTrusted: zod_1.z.boolean().default(false),
    isBlocked: zod_1.z.boolean().default(false),
    timestamp: zod_1.z.date()
});
exports.suspiciousLoginSchema = suspiciousLoginSchema;
//# sourceMappingURL=suspiciousLogin.model.js.map