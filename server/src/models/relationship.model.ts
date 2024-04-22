
import { z } from 'zod';
// Schema for Relationship
const RelationshipSchema = z.object({
  id: z.number().int(),
  follower: z.string(),
  following: z.string(),
});

export { RelationshipSchema };

type Relationship = z.infer<typeof RelationshipSchema>;