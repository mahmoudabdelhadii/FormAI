"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencesSchema = void 0;
const zod_1 = require("zod");
// Schema for Preferences
const PreferencesSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
    user: zod_1.z.string().optional(),
    enableContextBasedAuth: zod_1.z.boolean().optional(),
});
exports.PreferencesSchema = PreferencesSchema;
//# sourceMappingURL=preference.model.js.map