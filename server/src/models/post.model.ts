
import { z } from 'zod';


// Schema for PendingPost

// Schema for Post
const PostSchema = z.object({
  id: z.number().int(),
  Content: z.string().optional(),
  fileUrl: z.string(),
  community: z.number().int(),
  user: z.string(),
  caption: z.string().optional(),
});

export { PostSchema };

type Post = z.infer<typeof PostSchema>;