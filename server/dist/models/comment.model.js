"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Schema for Comment
const CommentSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    body: zod_1.z.string().optional(),
    user: zod_1.z.string(),
    post: zod_1.z.number().int(),
});
exports.default = { CommentSchema };
//# sourceMappingURL=comment.model.js.map