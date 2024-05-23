
import { z } from 'zod';
// Schema for Relationship
const RelationshipSchema = z.object({
  id: z.string(),
  follower: z.string(),
  following: z.string(),
});

export default RelationshipSchema;

type Relationship = z.infer<typeof RelationshipSchema>;