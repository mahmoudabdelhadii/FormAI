
import { z } from 'zod';
// Schema for Report
const ReportSchema = z.object({
  id: z.number().int(),
  reportedBy: z.string(),
  post: z.number().int(),
  community: z.number().int(),
  reportReason: z.string().optional(),
  reportDate: z.date().optional(),
});


export { ReportSchema };

type Report = z.infer<typeof ReportSchema>;