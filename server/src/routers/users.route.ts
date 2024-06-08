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
addUser,
forgotPassword,
resetPassword
} from '../controllers/user.controller';

import {
  getPublicUsers,
  followUser,
  getPublicUser,
  unfollowUser,
  getFollowingUsers,
  uploadProfilePic
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
import { setFileCategory } from '../middleware/setCatagory';
import { s3Upload } from '../middleware/posts/dataUpload';
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

router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.post('/logout', logout);

router.put('/:id', requireAuth,decodeToken, updateInfo);

router.use(followLimiter);
router.patch('/:id/follow', decodeToken, followUser);
router.patch('/:id/unfollow', decodeToken, unfollowUser);

router.post('/profile-pic', requireAuth, decodeToken,  setFileCategory,
s3Upload,uploadProfilePic);

export default router;
