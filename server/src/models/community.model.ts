
import { z } from 'zod';
// Schema for Community
const CommunitySchema = z.object({
  id: z.number().int(),
  name: z.string().optional(),
  description: z.string().optional(),
  CommunityRequest: z.array(z.any()), // Should be defined separately if detailed validation is needed
});

// Schema for CommunityRequest
const CommunityRequestSchema = z.object({
  id: z.number().int(),
  user: z.string().optional(),
  community: z.number().int().optional(),
  verifiedAt: z.date().optional(),
  requestedAt: z.date().optional()
});

export { CommunitySchema, CommunityRequestSchema };

type CommunityRequest = z.infer<typeof CommunityRequestSchema>;
type Community = z.infer<typeof CommunitySchema>;
