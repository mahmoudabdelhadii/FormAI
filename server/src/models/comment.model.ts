

import { z } from 'zod';


// Schema for Comment
const CommentSchema = z.object({
  id: z.string().uuid().optional(),
  body: z.string().trim().max(1000, "Comment body must be no more than 1000 characters long").optional(),
  userId: z.string().uuid(),
  postId: z.string().uuid(),
});

export default CommentSchema;

type Comment = z.infer<typeof CommentSchema>;

