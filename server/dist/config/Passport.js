"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const passport_jwt_1 = require("passport-jwt");
const passport_1 = __importDefault(require("passport"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const jwt = __importStar(require("jsonwebtoken"));
dotenv.config();
// Ensure that the environment variable is properly handled
const secretOrKey = process.env.SECRET;
if (!secretOrKey) {
    throw new Error("SECRET environment variable is not set.");
}
// Correctly initializing the opts object
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretOrKey,
};
passport_1.default.use(new passport_jwt_1.Strategy(opts, function (jwt_payload, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield prisma_1.default.user.findFirst({
                where: {
                    email: jwt_payload.email,
                }
            });
            //findOne({ email: jwt_payload.email });
            if (user) {
                const refreshTokenFromDB = yield prisma_1.default.token.findFirst({
                    where: {
                        user: user.username,
                    }
                });
                if (!refreshTokenFromDB) {
                    return done(null, false);
                }
                if (!refreshTokenFromDB.refreshToken) {
                    return done(null, false);
                }
                const refreshPayload = jwt.verify(refreshTokenFromDB.refreshToken, process.env.REFRESH_SECRET);
                // if (refreshPayload.email !== jwt_payload.email) {
                //     return done(null, false);
                // }
                const tokenExpiration = new Date(jwt_payload.exp * 1000);
                const now = new Date();
                const timeDifference = tokenExpiration.getTime() - now.getTime();
                if (timeDifference > 0 && timeDifference < 30 * 60 * 1000) {
                    const payloadNew = {
                        id: user.username,
                        email: user.email,
                    };
                    const newToken = jwt.sign(payloadNew, process.env.SECRET, {
                        expiresIn: "6h",
                    });
                    return done(null, { user, newToken });
                }
                return done(null, { user });
            }
            else {
                return done(null, false);
            }
        }
        catch (err) {
            return done(err, false);
        }
    });
}));
//# sourceMappingURL=Passport.js.map