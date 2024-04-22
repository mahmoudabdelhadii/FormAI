import * as dotenv from 'dotenv';
import {Strategy as JwtStrategy,StrategyOptions, ExtractJwt} from "passport-jwt";
import passport from "passport";
import prisma from "../utils/prisma"
import * as jwt from "jsonwebtoken";
dotenv.config();
interface JwtOptions {
    jwtFromRequest: ReturnType<typeof ExtractJwt.fromAuthHeaderAsBearerToken>;
    secretOrKey: string;
}

// Ensure that the environment variable is properly handled
const secretOrKey = process.env.SECRET;
if (!secretOrKey) {
    throw new Error("SECRET environment variable is not set.");
}

// Correctly initializing the opts object
const opts: JwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretOrKey,
};

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: jwt_payload.email,
        }
        
      }
      )
    
      //findOne({ email: jwt_payload.email });
      if (user) {
        const refreshTokenFromDB = await prisma.token.findFirst({
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

        const refreshPayload: string | jwt.JwtPayload = jwt.verify(
            refreshTokenFromDB.refreshToken,
            process.env.REFRESH_SECRET as string
        );

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
          const newToken = jwt.sign(payloadNew, process.env.SECRET as string, {
            expiresIn: "6h",
          });

          return done(null, { user, newToken });
        }
        return done(null, { user });
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);