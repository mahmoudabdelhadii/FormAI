import {z} from 'zod'

// Schema for AdminToken
const AdminTokenSchema = z.object({
  id: z.number().int(),
  user: z.string(),
  accessToken: z.string().optional(),
});


export { AdminTokenSchema };

type AdminToken = z.infer<typeof AdminTokenSchema>;