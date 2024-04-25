"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const EmailSchema = zod_1.z.object({
    id: zod_1.z.number().int(), // Assuming ID is always an integer
    email: zod_1.z.string().email(), // Optional email field which must be a valid email if provided
    verificationCode: zod_1.z.string().optional(), // Optional string field
    messageId: zod_1.z.string().optional(), // Optional string field
    for: zod_1.z.number().int().optional(), // Optional integer, relationship foreign key
    createdAt: zod_1.z.date().optional(), // Optional datetime field, default handled by the database
});
//# sourceMappingURL=email.model.js.map