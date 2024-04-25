"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendingPostSchema = void 0;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const zod_1 = require("zod");
const PendingPostSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    Content: zod_1.z.string().optional(),
    fileUrl: zod_1.z.string(),
    community: zod_1.z.number().int(),
    user: zod_1.z.string(),
    caption: zod_1.z.string().optional(),
    status: zod_1.z.number().int().optional(),
    confirmationToken: zod_1.z.string().optional(),
});
exports.PendingPostSchema = PendingPostSchema;
//# sourceMappingURL=pendingPost.model.js.map