
import { z } from 'zod';
const EmailSchema = z.object({
  id: z.number().int(), // Assuming ID is always an integer
  email: z.string().email(), // Optional email field which must be a valid email if provided
  verificationCode: z.string().optional(), // Optional string field
  messageId: z.string().optional(), // Optional string field
  for: z.number().int().optional(), // Optional integer, relationship foreign key
  createdAt: z.date().optional(), // Optional datetime field, default handled by the database

});

type Email = z.infer<typeof EmailSchema>;
