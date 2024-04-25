"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminTokenSchema = void 0;
const zod_1 = require("zod");
// Schema for AdminToken
const AdminTokenSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    user: zod_1.z.string(),
    accessToken: zod_1.z.string().optional(),
});
exports.AdminTokenSchema = AdminTokenSchema;
//# sourceMappingURL=token.admin.model.js.map