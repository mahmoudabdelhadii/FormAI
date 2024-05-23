


import { z } from 'zod';

// Schema for Log
const LogSchema = z.object({
  id: z.string().uuid().optional(),
  user: z.string().uuid().optional(),
  context: z.string().uuid().optional(),
  message: z.string().optional(),
  type: z.number().int().optional(),
  level: z.number().int().optional(),
  timestamp: z.date().optional(),
});

export default LogSchema;

type Log = z.infer<typeof LogSchema>;
