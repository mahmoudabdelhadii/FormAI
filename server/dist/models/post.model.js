"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = void 0;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const zod_1 = require("zod");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
// Schema for PendingPost
// Schema for Post
const PostSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    Content: zod_1.z.string().optional(),
    fileUrl: zod_1.z.string(),
    community: zod_1.z.number().int(),
    user: zod_1.z.string(),
    caption: zod_1.z.string().optional(),
});
exports.PostSchema = PostSchema;
//# sourceMappingURL=post.model.js.map