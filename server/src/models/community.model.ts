
import { z } from 'zod';
// Schema for Community

const CommunitySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().max(100, "Community name must be no more than 100 characters long").optional(),
  description: z.string().trim().max(1000, "Community description must be no more than 1000 characters long").optional(),
});


const CommunityUserSchema = z.object({
  id: z.string().uuid().optional(),
  communityId: z.string().uuid(),
  userId: z.string().uuid(),
  roleId: z.number().int(),
  verifiedAt: z.date().optional(),
});

type CommunityUser = z.infer<typeof CommunityUserSchema>;


// Schema for CommunityRequest
const CommunityRequestSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  communityId: z.string().uuid().optional(),
  requestedAt: z.date().optional(),
  message: z.string().optional(),
});

export { CommunitySchema, CommunityRequestSchema,CommunityUserSchema};

type CommunityRequest = z.infer<typeof CommunityRequestSchema>;
type Community = z.infer<typeof CommunitySchema>;
