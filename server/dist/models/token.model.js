"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenSchema = void 0;
const zod_1 = require("zod");
// Schema for Token
const TokenSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    user: zod_1.z.string(),
    refreshToken: zod_1.z.string().optional(),
    accessToken: zod_1.z.string().optional(),
    createdAt: zod_1.z.date(),
});
exports.TokenSchema = TokenSchema;
//# sourceMappingURL=token.model.js.map