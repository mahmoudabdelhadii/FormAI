"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/client");
const user_model_1 = __importDefault(require("../models/user.model"));
const prisma = new client_1.PrismaClient().$extends({
    query: {
        user: {
            create({ args, query }) {
                args.data = user_model_1.default.parse(args.data);
                return query(args);
            },
            update({ args, query }) {
                args.data = user_model_1.default.parse(args.data);
                return query(args);
            },
            updateMany({ args, query }) {
                args.data = user_model_1.default.parse(args.data);
                return query(args);
            },
            upsert({ args, query }) {
                args.create = user_model_1.default.parse(args.create);
                args.update = user_model_1.default.parse(args.update);
                return query(args);
            }
        }
    },
});
exports.default = prisma;
//# sourceMappingURL=prisma.js.map