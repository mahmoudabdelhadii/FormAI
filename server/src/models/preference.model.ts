import { z } from 'zod';
// Schema for Preferences
const PreferencesSchema = z.object({
  id: z.number().int(),
  user: z.string().optional(),
  enableContextBasedAuth: z.boolean().optional(),
});
export { PreferencesSchema };

type Preferences = z.infer<typeof PreferencesSchema>;