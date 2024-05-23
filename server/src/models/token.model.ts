import { z } from 'zod'
// Schema for Token
const TokenSchema = z.object({
  id: z.string().uuid().optional(),
  user: z.string().uuid(),
  refreshToken: z.string(),
  accessToken: z.string(),
  createdAt: z.date().optional(),
  salt: z.number().int(),
});

export default TokenSchema;

type Token = z.infer<typeof TokenSchema>;
