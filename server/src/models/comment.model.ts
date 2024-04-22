

import { z } from 'zod';


// Schema for Comment
const CommentSchema = z.object({
  id: z.number().int(),
  body: z.string().optional(),
  user: z.string(),
  post: z.number().int(),
});

export default { CommentSchema };

type Comment = z.infer<typeof CommentSchema>;