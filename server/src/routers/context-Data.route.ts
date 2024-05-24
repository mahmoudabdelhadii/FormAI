import express from 'express';
import passport from 'passport';
import useragent from 'express-useragent';
import { useragentMiddleware } from '../middleware/userAgent';
import {
  addContextData,
  getAuthContextData,
  getTrustedAuthContextData,
  getBlockedAuthContextData,
  getUserPreferences,
  deleteContextAuthData,
  blockContextAuthData,
  unblockContextAuthData,
} from '../controllers/auth.controller';

import {
  verifyEmailValidation,
  verifyEmail,
} from '../middleware/users/verifyEmail';

import {
  verifyLogin,
  blockLogin,
  verifyLoginValidation
} from '../middleware/users/verifyLogin';

import decodeToken from '../middleware/auth/decodeToken';

const router = express.Router();

const requireAuth = passport.authenticate('jwt', { session: false });

router.get(
  '/context-data/primary',
  requireAuth,
  decodeToken,
  getAuthContextData
);

router.get(
  '/context-data/trusted',
  requireAuth,
  decodeToken,
  getTrustedAuthContextData
);

router.get(
  '/context-data/blocked',
  requireAuth,
  decodeToken,
  getBlockedAuthContextData
);

router.use(useragentMiddleware)
router.get('/user-preferences',requireAuth, decodeToken, getUserPreferences);

router.delete('/context-data/:contextId', requireAuth,deleteContextAuthData);

router.patch('/context-data/block/:contextId',requireAuth, blockContextAuthData);

router.patch('/context-data/unblock/:contextId', requireAuth, unblockContextAuthData);


router.use(useragent.express());
router.get('/verify', verifyEmailValidation, verifyEmail, addContextData);
router.get('/verify-login', verifyLoginValidation, verifyLogin);
router.get('/block-login', verifyLoginValidation, blockLogin);

export default router;
