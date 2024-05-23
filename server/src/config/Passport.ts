import dotenv from 'dotenv';
import prisma from '../utils/prisma';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import {sign, verify} from 'jsonwebtoken';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET as string,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: jwt_payload.email },
            { username: jwt_payload.username }
          ]
        }
      });

      if (user) {
        const refreshTokenFromDB = await prisma.token.findUnique({
          where: { user: user.id },
        });

        if (!refreshTokenFromDB) {
          return done(null, false);
        }

        const refreshPayload = verify(
          refreshTokenFromDB.refreshToken as string,
          process.env.REFRESH_SECRET as string
        ) as any;

        if (
          refreshPayload.email !== jwt_payload.email &&
          refreshPayload.username !== jwt_payload.username
        ) {
          return done(null, false);
        }

        const tokenExpiration = new Date(jwt_payload.exp * 1000);
        const now = new Date();
        const timeDifference = tokenExpiration.getTime() - now.getTime();

        if (timeDifference > 0 && timeDifference < 30 * 60 * 1000) {
          const payloadNew = {
            id: user.id,
            email: user.email,
            username: user.username
          };
          const newToken = sign(payloadNew, process.env.SECRET as string, {
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

export default passport;
