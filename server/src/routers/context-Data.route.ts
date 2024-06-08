/**
 * This file contains the ExpressJS router for managing context data.
 * Context data is information about the user's device, browser and operating system.
 * It is used to improve security and detect potential phishing attempts.
 */

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

/**
 * This router requires authentication with a JWT token.
 * The token is verified by the `decodeToken` middleware.
 */
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();
/**
 * Get the context data for the current user.
 * The context data includes information about the user's device, browser and operating system.
 */
router.get(
  '/context-data/primary',
  requireAuth,
  decodeToken,
  getAuthContextData
);

/**
 * Get the trusted context data for the current user.
 * The trusted context data is information about the user's device, browser and operating system
 * that has been verified by email or login.
 */
router.get(
  '/context-data/trusted',
  requireAuth,
  decodeToken,
  getTrustedAuthContextData
);

/**
 * Get the blocked context data for the current user.
 * The blocked context data is information about the devices and browsers that are
 * blocked from signing in.
 */
router.get(
  '/context-data/blocked',
  requireAuth,
  decodeToken,
  getBlockedAuthContextData
);

/**
 * Add the user agent middleware to the context data router.
 * This middleware adds information about the user's browser and operating system
 * to the request object.
 */
router.use(useragentMiddleware)
/**
 * Get the user preferences for the current user.
 * User preferences include information about the user's preferred language and time zone.
 */
router.get('/user-preferences',requireAuth, decodeToken, getUserPreferences);

/**
 * Delete context data for the current user.
 * @param {string} contextId - The ID of the context data to delete.
 */
router.delete('/context-data/:contextId', requireAuth,deleteContextAuthData);

/**
 * Block context data for the current user.
 * @param {string} contextId - The ID of the context data to block.
 */
router.patch('/context-data/block/:contextId',requireAuth, blockContextAuthData);

/**
 * Unblock context data for the current user.
 * @param {string} contextId - The ID of the context data to unblock.
 */
router.patch('/context-data/unblock/:contextId', requireAuth, unblockContextAuthData);

/**
 * Add the user agent middleware to the context data router.
 * This middleware adds information about the user's browser and operating system
 * to the request object.
 */
router.use(useragent.express());

/**
 * Verify email address.
 * This endpoint is used to verify an email address and add context data
 * to the user's account.
 */
router.get('/verify', verifyEmailValidation, verifyEmail, addContextData);

/**
 * Verify login credentials.
 * This endpoint is used to verify login credentials and add context data
 * to the user's account.
 */
router.get('/verify-login', verifyLoginValidation, verifyLogin);

/**
 * Block a login attempt from the user's IP address.
 * This endpoint is used to block a login attempt from the user's IP address
 * if the login credentials are incorrect.
 */
router.get('/block-login', verifyLoginValidation, blockLogin);

export default router;

