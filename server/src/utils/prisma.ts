import { PrismaClient } from '../generated/client'
import UserSchema from '../models/user.model'
const prisma = new PrismaClient().$extends({
    query: {
     user: {
        create({ args, query }) {
          args.data = UserSchema.parse(args.data)
          return query(args)
        },
        update({ args, query }) {
          args.data = UserSchema.parse(args.data)
          return query(args)
        },
        updateMany({ args, query }) {
          args.data = UserSchema.parse(args.data)
          return query(args)
        },
        upsert({ args, query }) {
          args.create = UserSchema.parse(args.create)
          args.update = UserSchema.parse(args.update)
          return query(args)
        }
    }
    },
  })


export default prisma;