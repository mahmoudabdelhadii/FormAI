
import { z } from 'zod';
const EmailSchema = z.object({
  email: z.string().email("Invalid email").optional(),
  verificationCode: z.string().optional(),
  messageId: z.string().optional(),
  for: z.number().int(),
  createdAt: z.date().optional()

});

const EmailForSchema = z.object({
  id:  z.number().int(),
  for: z.string().optional(),
});


type EmailFor = z.infer<typeof EmailForSchema>;


export  {EmailForSchema,EmailSchema};

type Email = z.infer<typeof EmailSchema>;


