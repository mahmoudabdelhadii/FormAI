


import { z } from 'zod';

// Zod schema for Admin
const AdminSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters long").max(20, "Username must be no more than 20 characters long").refine(value => /^[a-zA-Z0-9]+$/.test(value), {
    message: "Username can only contain alphanumeric characters",
  }),
  password: z.string().trim().min(6, "Password must be at least 6 characters long"),
  createdAt: z.date().optional(), // These are handled by your database or ORM
  updatedAt: z.date().optional(),
});

export default { AdminSchema };


type Admin = z.infer<typeof AdminSchema>;
