"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogSchema = void 0;
const mongoose = require("mongoose");
const { encryptField, decryptField, decryptData, } = require("../utils/encryption");
const zod_1 = require("zod");
// Schema for Log
const LogSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    email: zod_1.z.string().optional(),
    context: zod_1.z.string().optional(),
    message: zod_1.z.string().optional(),
    type: zod_1.z.string().optional(),
    level: zod_1.z.string().optional(),
    timestamp: zod_1.z.date().optional(),
});
exports.LogSchema = LogSchema;
//# sourceMappingURL=log.model.js.map