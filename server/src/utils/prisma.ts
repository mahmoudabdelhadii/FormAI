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
        args.data = UserSchema.partial().parse(args.data);
        return query(args);
      },
      upsert({ args, query }: { args: Prisma.UserUpsertArgs; query: (args: Prisma.UserUpsertArgs) => any }) {
        args.create = UserSchema.parse(args.create);
        args.update = UserSchema.partial().parse(args.update);
        return query(args);
      },
    },
    comment: {
      create({ args, query }: { args: Prisma.CommentCreateArgs; query: (args: Prisma.CommentCreateArgs) => any }) {
        args.data = CommentSchema.parse(args.data);
        return query(args);
      },
      update({ args, query }: { args: Prisma.CommentUpdateArgs; query: (args: Prisma.CommentUpdateArgs) => any }) {
        args.data = CommentSchema.partial().parse(args.data);
        return query(args);
      },
      upsert({ args, query }: { args: Prisma.CommentUpsertArgs; query: (args: Prisma.CommentUpsertArgs) => any }) {
        args.create = CommentSchema.parse(args.create);
        args.update = CommentSchema.partial().parse(args.update);
        return query(args);
      },
    },
    community: {
      create({ args, query }: { args: Prisma.CommunityCreateArgs; query: (args: Prisma.CommunityCreateArgs) => any }) {
        args.data = CommunitySchema.parse(args.data);
        return query(args);
      },
      update({ args, query }: { args: Prisma.CommunityUpdateArgs; query: (args: Prisma.CommunityUpdateArgs) => any }) {
        args.data = CommunitySchema.partial().parse(args.data);
        return query(args);
      },
      upsert({ args, query }: { args: Prisma.CommunityUpsertArgs; query: (args: Prisma.CommunityUpsertArgs) => any }) {
        args.create = CommunitySchema.parse(args.create);
        args.update = CommunitySchema.partial().parse(args.update);
        return query(args);
      },
    },
    token: {
      create({ args, query }: { args: Prisma.TokenCreateArgs; query: (args: Prisma.TokenCreateArgs) => any }) {
        args.data = TokenSchema.parse(args.data);
        return query(args);
      },
      update({ args, query }: { args: Prisma.TokenUpdateArgs; query: (args: Prisma.TokenUpdateArgs) => any }) {
        args.data = TokenSchema.partial().parse(args.data);
        return query(args);
      },
      upsert({ args, query }: { args: Prisma.TokenUpsertArgs; query: (args: Prisma.TokenUpsertArgs) => any }) {
        args.create = TokenSchema.parse(args.create);
        args.update = TokenSchema.partial().parse(args.update);
        return query(args);
      },
    },
    
  },
});

export default prisma;
