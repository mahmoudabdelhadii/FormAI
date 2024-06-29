import { access } from 'fs';
import { z } from 'zod'
import { refreshToken } from '../controllers/user.controller';
// Schema for Token
const TokenSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  refreshToken: z.string(),
  accessToken: z.string(),
  createdAt: z.date().optional(),
  accessTokenExpiresAt: z.date(),
  refreshTokenExpiresAt: z.date(),
});

export default TokenSchema;

type Token = z.infer<typeof TokenSchema>;
