"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationshipSchema = void 0;
const zod_1 = require("zod");
// Schema for Relationship
const RelationshipSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    follower: zod_1.z.string(),
    following: zod_1.z.string(),
});
exports.RelationshipSchema = RelationshipSchema;
//# sourceMappingURL=relationship.model.js.map