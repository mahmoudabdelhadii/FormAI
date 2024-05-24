import { Router } from 'express';
import passport from 'passport';
import useragent from 'express-useragent';
import requestIp from 'request-ip';

import {
  
  signin,
  logout,
  refreshToken,
  updateInfo,
  getUser,
addUser
  
} from '../controllers/user.controller';

import {
  getPublicUsers,
  followUser,
  getPublicUser,
  unfollowUser,
  getFollowingUsers,
} from '../controllers/profile.controller';

// import {
//   addUserValidator,
//   addUserValidatorHandler,
// } from '../middleware/users/usersValidator.js';

import { sendVerificationEmail } from '../middleware/users/verifyEmail';
import { sendLoginVerificationEmail } from '../middleware/users/verifyLogin';

// import avatarUpload from '../middlewares/users/avatarUpload.js';
import {
  signUpSignInLimiter,
  followLimiter,
} from '../middleware/limiter/limiter';

import decodeToken from '../middleware/auth/decodeToken';
import { userValidator } from '../middleware/validators/validator';
const router = Router();
const requireAuth = passport.authenticate('jwt', { session: false });
// const requireAuth = passport.authenticate('jwt', { session: false });

router.get("/public-users/:id", requireAuth, decodeToken, getPublicUser);
router.get("/public-users", requireAuth, decodeToken, getPublicUsers);
router.get("/following", requireAuth, decodeToken, getFollowingUsers);
router.get("/:id", requireAuth, getUser);

router.post(
  '/signup',
  signUpSignInLimiter,
//   avatarUpload,
userValidator,
//   addUserValidatorHandler,
  addUser,
  sendVerificationEmail
);

router.post('/refresh-token', refreshToken);

router.post(
  '/signin',
  signUpSignInLimiter,
  requestIp.mw(),
  useragent.express(),
  signin,
  sendLoginVerificationEmail
);

router.post('/logout', logout);

router.put('/:id', requireAuth,decodeToken, updateInfo);

router.use(followLimiter);
router.patch('/:id/follow', decodeToken, followUser);
router.patch('/:id/unfollow', decodeToken, unfollowUser);

export default router;
