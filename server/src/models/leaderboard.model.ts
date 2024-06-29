import {z} from "zod"
const LeaderboardSchema = z.object({
    id: z.string().uuid().optional(),
    community: z.string().uuid(),
  });
  

  const LeaderboardSubmissionSchema = z.object({
    id: z.string().uuid().optional(),
    user: z.string().uuid().optional(),
    community: z.string().uuid().optional(),
    entryUrl: z.string().optional(),
    verifiedBy: z.string().uuid().optional(),
    weight: z.number().int().optional(),
    type: z.number().int().optional(),
    verifiedAt: z.date().optional(),
    rank: z.number().int().optional(),

  });

  const LeaderboardSubmissionTypeSchema = z.object({
    id: z.string().uuid().optional(),
    type: z.string().optional(),
    leaderboardSubmissionId: z.string().uuid().optional(),
  });
  

  
  type LeaderboardSubmissionType = z.infer<typeof LeaderboardSubmissionTypeSchema>;
  

  
  type LeaderboardSubmission = z.infer<typeof LeaderboardSubmissionSchema>;

  
  export  {LeaderboardSchema,LeaderboardSubmissionSchema,LeaderboardSubmissionTypeSchema};
  

  type Leaderboard = z.infer<typeof LeaderboardSchema>;
  