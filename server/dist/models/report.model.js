"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSchema = void 0;
const zod_1 = require("zod");
// Schema for Report
const ReportSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    reportedBy: zod_1.z.string(),
    post: zod_1.z.number().int(),
    community: zod_1.z.number().int(),
    reportReason: zod_1.z.string().optional(),
    reportDate: zod_1.z.date().optional(),
});
exports.ReportSchema = ReportSchema;
//# sourceMappingURL=report.model.js.map