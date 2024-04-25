"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Zod schema for Admin
const AdminSchema = zod_1.z.object({
    username: zod_1.z.string().trim().min(3, "Username must be at least 3 characters long").max(20, "Username must be no more than 20 characters long").refine(value => /^[a-zA-Z0-9]+$/.test(value), {
        message: "Username can only contain alphanumeric characters",
    }),
    password: zod_1.z.string().trim().min(6, "Password must be at least 6 characters long"),
    createdAt: zod_1.z.date().optional(), // These are handled by your database or ORM
    updatedAt: zod_1.z.date().optional(),
});
exports.default = { AdminSchema };
//# sourceMappingURL=admin.model.js.map