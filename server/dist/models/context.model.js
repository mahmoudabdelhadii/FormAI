"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextSchema = void 0;
const mongoose = require("mongoose");
const { encryptField, decryptField } = require("../utils/encryption");
const zod_1 = require("zod");
// Schema for Context
const ContextSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    user: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    ip: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    browser: zod_1.z.string().optional(),
    platform: zod_1.z.string().optional(),
    os: zod_1.z.string().optional(),
    device: zod_1.z.string().optional(),
    deviceType: zod_1.z.string().optional(),
    isTrusted: zod_1.z.boolean().optional(),
});
exports.ContextSchema = ContextSchema;
//# sourceMappingURL=context.model.js.map