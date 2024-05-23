

import { z } from 'zod';

const PendingPostSchema = z.object({
  id: z.string().uuid().optional(),
  content: z.string().optional(),
  fileUrl: z.string(),
  community: z.string().uuid(),
  user: z.string().uuid(),
  caption: z.string().optional(),
  status: z.string().optional(),
  confirmationToken: z.string().optional(),
});

export default PendingPostSchema;

type PendingPost = z.infer<typeof PendingPostSchema>;





