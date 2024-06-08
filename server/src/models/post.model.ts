
import { z } from 'zod';


// Schema for PendingPost

// Schema for Post
const PostSchema = z.object({
  id: z.string().uuid(), // Assuming the id is a UUID
  content: z.string().optional(),
  fileUrl: z.string(),
  fileType: z.string(), // fileType field with a default value
  communityId: z.string().uuid().optional(), // Assuming communityId is a UUID
  userId: z.string().uuid(), // Assuming userId is a UUID
  caption: z.string().optional(),
  createdAt: z.date().optional().default(new Date()), // Assuming createdAt is a Date
  visibility: z.enum(["PUBLIC", "PRIVATE", "COMMUNITY"]).optional().default("PUBLIC"), // Assuming visibility is an enum
});


export { PostSchema };

type Post = z.infer<typeof PostSchema>;