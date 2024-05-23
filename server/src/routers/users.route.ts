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

// import {
//   getPublicUsers,
//   followUser,
//   getPublicUser,
//   unfollowUser,
//   getFollowingUsers,
// } from '../controllers/profile.controller.js';

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

const router = Router();
// const requireAuth = passport.authenticate('jwt', { session: false });

// router.get('/public-users/:id', decodeToken, getPublicUser);
// router.get('/public-users', decodeToken, getPublicUsers);
// router.get('/moderator', decodeToken, getModProfile);
// router.get('/following', decodeToken, getFollowingUsers);
router.get('/:id', getUser);

router.post(
  '/signup',
//   signUpSignInLimiter,
//   avatarUpload,
//   addUserValidator,
//   addUserValidatorHandler,
  addUser,
//   sendVerificationEmail
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

router.put('/:id', decodeToken, updateInfo);

// router.use(followLimiter);
// router.patch('/:id/follow', decodeToken, followUser);
// router.patch('/:id/unfollow', decodeToken, unfollowUser);

export default router;
