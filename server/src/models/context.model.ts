const mongoose = require("mongoose");
const { encryptField, decryptField } = require("../utils/encryption");
import { z } from 'zod';
// Schema for Context
const ContextSchema = z.object({
  id: z.number().int(),
  user: z.string().optional(),
  email: z.string().optional(),
  ip: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  browser: z.string().optional(),
  platform: z.string().optional(),
  os: z.string().optional(),
  device: z.string().optional(),
  deviceType: z.string().optional(),
  isTrusted: z.boolean().optional(),
});
export { ContextSchema };

export type Context = z.infer<typeof ContextSchema>;