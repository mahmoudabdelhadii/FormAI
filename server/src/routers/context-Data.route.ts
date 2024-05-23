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
  
  decodeToken,
  getAuthContextData
);

router.get(
  '/context-data/trusted',
  
  decodeToken,
  getTrustedAuthContextData
);

router.get(
  '/context-data/blocked',
  
  decodeToken,
  getBlockedAuthContextData
);

router.use(useragentMiddleware)
router.get('/user-preferences', decodeToken, getUserPreferences);

router.delete('/context-data/:contextId', deleteContextAuthData);

router.patch('/context-data/block/:contextId', blockContextAuthData);

router.patch('/context-data/unblock/:contextId', unblockContextAuthData);



router.get('/verify', verifyEmailValidation, verifyEmail, addContextData);
router.get('/verify-login', verifyLoginValidation, verifyLogin);
router.get('/block-login', verifyLoginValidation, blockLogin);

export default router;
