"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityRequestSchema = exports.CommunitySchema = void 0;
const zod_1 = require("zod");
// Schema for Community
const CommunitySchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    CommunityRequest: zod_1.z.array(zod_1.z.any()), // Should be defined separately if detailed validation is needed
});
exports.CommunitySchema = CommunitySchema;
// Schema for CommunityRequest
const CommunityRequestSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    user: zod_1.z.string().optional(),
    community: zod_1.z.number().int().optional(),
    verifiedAt: zod_1.z.date().optional(),
    requestedAt: zod_1.z.date().optional()
});
exports.CommunityRequestSchema = CommunityRequestSchema;
//# sourceMappingURL=community.model.js.map