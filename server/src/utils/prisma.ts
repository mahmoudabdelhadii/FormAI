import { PrismaClient,Prisma } from '../generated/client'
import {UserSchema} from '../models/user.model';
import CommentSchema from '../models/comment.model';
import AdminSchema from '../models/admin.model';
import RelationshipSchema from '../models/relationship.model';
import ReportSchema from '../models/report.model';
import LogSchema from '../models/log.model';
import SuspiciousLoginSchema from '../models/suspiciousLogin.model';
import { LeaderboardSchema, LeaderboardSubmissionSchema } from '../models/leaderboard.model';
import PendingPostSchema from '../models/pendingPost.model';
import { EmailSchema, EmailForSchema } from '../models/email.model';
import { CommunitySchema, CommunityRequestSchema, CommunityUserSchema } from '../models/community.model';
import TokenSchema from '../models/token.model';

const prisma = new PrismaClient().$extends({
  query: {
    user: {
      create({ args, query }: { args: Prisma.UserCreateArgs; query: (args: Prisma.UserCreateArgs) => any }) {
        args.data = UserSchema.parse(args.data);
        return query(args);
      },
      update({ args, query }: { args: Prisma.UserUpdateArgs; query: (args: Prisma.UserUpdateArgs) => any }) {
        args.data = UserSchema.parse(args.data);
        return query(args);
      },
      upsert({ args, query }: { args: Prisma.UserUpsertArgs; query: (args: Prisma.UserUpsertArgs) => any }) {
        args.create = UserSchema.parse(args.create);
        args.update = UserSchema.parse(args.update);
        return query(args);
      },
    },
    comment: {
      create({ args, query }: { args: Prisma.CommentCreateArgs; query: (args: Prisma.CommentCreateArgs) => any }) {
        args.data = CommentSchema.parse(args.data);
        return query(args);
      },
      update({ args, query }: { args: Prisma.CommentUpdateArgs; query: (args: Prisma.CommentUpdateArgs) => any }) {
        args.data = CommentSchema.parse(args.data);
        return query(args);
      },
      upsert({ args, query }: { args: Prisma.CommentUpsertArgs; query: (args: Prisma.CommentUpsertArgs) => any }) {
        args.create = CommentSchema.parse(args.create);
        args.update = CommentSchema.parse(args.update);
        return query(args);
      },
    },
    community: {
      create({ args, query }: { args: Prisma.CommunityCreateArgs; query: (args: Prisma.CommunityCreateArgs) => any }) {
        args.data = CommunitySchema.parse(args.data);
        return query(args);
      },
      update({ args, query }: { args: Prisma.CommunityUpdateArgs; query: (args: Prisma.CommunityUpdateArgs) => any }) {
        args.data = CommunitySchema.parse(args.data);
        return query(args);
      },
      upsert({ args, query }: { args: Prisma.CommunityUpsertArgs; query: (args: Prisma.CommunityUpsertArgs) => any }) {
        args.create = CommunitySchema.parse(args.create);
        args.update = CommunitySchema.parse(args.update);
        return query(args);
      },
    },
    token: {
      create({ args, query }: { args: Prisma.TokenCreateArgs; query: (args: Prisma.TokenCreateArgs) => any }) {
        args.data = TokenSchema.parse(args.data);
        return query(args);
      },
      update({ args, query }: { args: Prisma.TokenUpdateArgs; query: (args: Prisma.TokenUpdateArgs) => any }) {
        args.data = TokenSchema.parse(args.data);
        return query(args);
      },
      upsert({ args, query }: { args: Prisma.TokenUpsertArgs; query: (args: Prisma.TokenUpsertArgs) => any }) {
        args.create = TokenSchema.parse(args.create);
        args.update = TokenSchema.parse(args.update);
        return query(args);
      },
    },
    // communityUser: {
    //   create({ args, query }: { args: Prisma.CommunityUserCreateArgs; query: (args: Prisma.CommunityUserCreateArgs) => any }) {
    //     args.data = CommunityUserSchema.parse(args.data);
    //     return query(args);
    //   },
    //   update({ args, query }: { args: Prisma.CommunityUserUpdateArgs; query: (args: Prisma.CommunityUserUpdateArgs) => any }) {
    //     args.data = CommunityUserSchema.parse(args.data);
    //     return query(args);
    //   },
    //   upsert({ args, query }: { args: Prisma.CommunityUserUpsertArgs; query: (args: Prisma.CommunityUserUpsertArgs) => any }) {
    //     args.create = CommunityUserSchema.parse(args.create);
    //     args.update = CommunityUserSchema.parse(args.update);
    //     return query(args);
    //   },
    // },
    // admin: {
    //   create({ args, query }: { args: Prisma.AdminCreateArgs; query: (args: Prisma.AdminCreateArgs) => any }) {
    //     args.data = AdminSchema.parse(args.data);
    //     return query(args);
    //   },
    //   update({ args, query }: { args: Prisma.AdminUpdateArgs; query: (args: Prisma.AdminUpdateArgs) => any }) {
    //     args.data = AdminSchema.parse(args.data);
    //     return query(args);
    //   },
    //   upsert({ args, query }: { args: Prisma.AdminUpsertArgs; query: (args: Prisma.AdminUpsertArgs) => any }) {
    //     args.create = AdminSchema.parse(args.create);
    //     args.update = AdminSchema.parse(args.update);
    //     return query(args);
    //   },
    // },
    // relationship: {
    //   create({ args, query }: { args: Prisma.RelationshipCreateArgs; query: (args: Prisma.RelationshipCreateArgs) => any }) {
    //     args.data = RelationshipSchema.parse(args.data);
    //     return query(args);
    //   },
    //   update({ args, query }: { args: Prisma.RelationshipUpdateArgs; query: (args: Prisma.RelationshipUpdateArgs) => any }) {
    //     args.data = RelationshipSchema.parse(args.data);
    //     return query(args);
    //   },
    //   upsert({ args, query }: { args: Prisma.RelationshipUpsertArgs; query: (args: Prisma.RelationshipUpsertArgs) => any }) {
    //     args.create = RelationshipSchema.parse(args.create);
    //     args.update = RelationshipSchema.parse(args.update);
    //     return query(args);
    //   },
    // },
    // report: {
    //   create({ args, query }: { args: Prisma.ReportCreateArgs; query: (args: Prisma.ReportCreateArgs) => any }) {
    //     args.data = ReportSchema.parse(args.data);
    //     return query(args);
    //   },
    //   update({ args, query }: { args: Prisma.ReportUpdateArgs; query: (args: Prisma.ReportUpdateArgs) => any }) {
    //     args.data = ReportSchema.parse(args.data);
    //     return query(args);
    //   },
    //   upsert({ args, query }: { args: Prisma.ReportUpsertArgs; query: (args: Prisma.ReportUpsertArgs) => any }) {
    //     args.create = ReportSchema.parse(args.create);
    //     args.update = ReportSchema.parse(args.update);
    //     return query(args);
    //   },
    // },
    // log: {
    //   create({ args, query }: { args: Prisma.LogCreateArgs; query: (args: Prisma.LogCreateArgs) => any }) {
    //     args.data = LogSchema.parse(args.data);
    //     return query(args);
    //   },
    //   update({ args, query }: { args: Prisma.LogUpdateArgs; query: (args: Prisma.LogUpdateArgs) => any }) {
    //     args.data = LogSchema.parse(args.data);
    //     return query(args);
    //   },
    //   upsert({ args, query }: { args: Prisma.LogUpsertArgs; query: (args: Prisma.LogUpsertArgs) => any }) {
    //     args.create = LogSchema.parse(args.create);
    //     args.update = LogSchema.parse(args.update);
    //     return query(args);
    //   },
    // },
    // suspiciousLogin: {
    //   create({ args, query }: { args: Prisma.SuspiciousLoginCreateArgs; query: (args: Prisma.SuspiciousLoginCreateArgs) => any }) {
    //     args.data = SuspiciousLoginSchema.parse(args.data);
    //     return query(args);
    //   },
    //   update({ args, query }: { args: Prisma.SuspiciousLoginUpdateArgs; query: (args: Prisma.SuspiciousLoginUpdateArgs) => any }) {
    //     args.data = SuspiciousLoginSchema.parse(args.data);
    //     return query(args);
    //   },
    //   upsert({ args, query }: { args: Prisma.SuspiciousLoginUpsertArgs; query: (args: Prisma.SuspiciousLoginUpsertArgs) => any }) {
    //     args.create = SuspiciousLoginSchema.parse(args.create);
    //     args.update = SuspiciousLoginSchema.parse(args.update);
    //     return query(args);
    //   },
    // },
    // communityRequest: {
    //   create({ args, query }: { args: Prisma.CommunityRequestCreateArgs; query: (args: Prisma.CommunityRequestCreateArgs) => any }) {
    //     args.data = CommunityRequestSchema.parse(args.data);
    //     return query(args);
    //   },
    //   update({ args, query }: { args: Prisma.CommunityRequestUpdateArgs; query: (args: Prisma.CommunityRequestUpdateArgs) => any }) {
    //     args.data = CommunityRequestSchema.parse(args.data);
    //     return query(args);
    //   },
    //   upsert({ args, query }: { args: Prisma.CommunityRequestUpsertArgs; query: (args: Prisma.CommunityRequestUpsertArgs) => any }) {
    //     args.create = CommunityRequestSchema.parse(args.create);
    //     args.update = CommunityRequestSchema.parse(args.update);
    //     return query(args);
    //   },
    // },
    // leaderboard: {
    //   create({ args, query }: { args: Prisma.LeaderboardCreateArgs; query: (args: Prisma.LeaderboardCreateArgs) => any }) {
    //     args.data = LeaderboardSchema.parse(args.data);
    //     return query(args);
    //   },
    //   update({ args, query }: { args: Prisma.LeaderboardUpdateArgs; query: (args: Prisma.LeaderboardUpdateArgs) => any }) {
    //     args.data = LeaderboardSchema.parse(args.data);
    //     return query(args);
    //   },
    //   upsert({ args, query }: { args: Prisma.LeaderboardUpsertArgs; query: (args: Prisma.LeaderboardUpsertArgs) => any }) {
    //     args.create = LeaderboardSchema.parse(args.create);
    //     args.update = LeaderboardSchema.parse(args.update);
    //     return query(args);
    //   },
    // },
    // leaderboardSubmission: {
    //   create({ args, query }: { args: Prisma.LeaderboardSubmissionCreateArgs; query: (args: Prisma.LeaderboardSubmissionCreateArgs) => any }) {
    //     args.data = LeaderboardSubmissionSchema.parse(args.data);
    //     return query(args);
    //   },
    //   update({ args, query }: { args: Prisma.LeaderboardSubmissionUpdateArgs; query: (args: Prisma.LeaderboardSubmissionUpdateArgs) => any }) {
    //     args.data = LeaderboardSubmissionSchema.parse(args.data);
    //     return query(args);
    //   },
    //   upsert({ args, query }: { args: Prisma.LeaderboardSubmissionUpsertArgs; query: (args: Prisma.LeaderboardSubmissionUpsertArgs) => any }) {
    //     args.create = LeaderboardSubmissionSchema.parse(args.create);
    //     args.update = LeaderboardSubmissionSchema.parse(args.update);
    //     return query(args);
    //   },
    // },
    // pendingPost: {
    //   create({ args, query }: { args: Prisma.PendingPostCreateArgs; query: (args: Prisma.PendingPostCreateArgs) => any }) {
    //     args.data = PendingPostSchema.parse(args.data);
    //     return query(args);
    //   },
    //   update({ args, query }: { args: Prisma.PendingPostUpdateArgs; query: (args: Prisma.PendingPostUpdateArgs) => any }) {
    //     args.data = PendingPostSchema.parse(args.data);
    //     return query(args);
    //   },
    //   upsert({ args, query }: { args: Prisma.PendingPostUpsertArgs; query: (args: Prisma.PendingPostUpsertArgs) => any }) {
    //     args.create = PendingPostSchema.parse(args.create);
    //     args.update = PendingPostSchema.parse(args.update);
    //     return query(args);
    //   },
    // },
    // email: {
    //   create({ args, query }: { args: Prisma.EmailCreateArgs; query: (args: Prisma.EmailCreateArgs) => any }) {
    //     args.data = EmailSchema.parse(args.data);
    //     return query(args);
    //   },
    //   update({ args, query }: { args: Prisma.EmailUpdateArgs; query: (args: Prisma.EmailUpdateArgs) => any }) {
    //     args.data = EmailSchema.parse(args.data);
    //     return query(args);
    //   },
    //   upsert({ args, query }: { args: Prisma.EmailUpsertArgs; query: (args: Prisma.EmailUpsertArgs) => any }) {
    //     args.create = EmailSchema.parse(args.create);
    //     args.update = EmailSchema.parse(args.update);
    //     return query(args);
    //   },
    // },
    // emailFor: {
    //   create({ args, query }: { args: Prisma.EmailForCreateArgs; query: (args: Prisma.EmailForCreateArgs) => any }) {
    //     args.data = EmailForSchema.parse(args.data);
    //     return query(args);
    //   },
    //   update({ args, query }: { args: Prisma.EmailForUpdateArgs; query: (args: Prisma.EmailForUpdateArgs) => any }) {
    //     args.data = EmailForSchema.parse(args.data);
    //     return query(args);
    //   },
    //   upsert({ args, query }: { args: Prisma.EmailForUpsertArgs; query: (args: Prisma.EmailForUpsertArgs) => any }) {
    //     args.create = EmailForSchema.parse(args.create);
    //     args.update = EmailForSchema.parse(args.update);
    //     return query(args);
    //   },
    // },
  },
});

export default prisma;
