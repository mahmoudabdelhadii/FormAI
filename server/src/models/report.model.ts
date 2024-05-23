
import { z } from 'zod';
// Schema for Report
const ReportSchema = z.object({
  id: z.string().uuid().optional(),
  reportedBy: z.string().uuid(),
  post: z.string().uuid(),
  community: z.string().uuid(),
  reportReason: z.string().optional(),
  reportDate: z.date().optional(),
});

export default ReportSchema;

type Report = z.infer<typeof ReportSchema>;