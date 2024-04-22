import { z } from 'zod'
// Schema for Token
const TokenSchema = z.object({
  id: z.number().int(),
  user: z.string(),
  refreshToken: z.string().optional(),
  accessToken: z.string().optional(),
  createdAt: z.date(),
});

export { TokenSchema };

type Token = z.infer<typeof TokenSchema>;