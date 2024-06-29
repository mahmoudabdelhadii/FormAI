import { z } from 'zod';
// Schema for Context
const SuspiciousLoginSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  email: z.string().optional(),
  ip: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  os: z.string().optional(),
  device: z.string().optional(),
  deviceType: z.string().optional(),
  unverifiedAttempts:z.number().int().default(0),
  isTrusted:z.boolean().default(false),
  isBlocked:z.boolean().default(false),
  timestamp:z.date()
});

export default SuspiciousLoginSchema;

export type suspiciousLogin = z.infer<typeof SuspiciousLoginSchema>;