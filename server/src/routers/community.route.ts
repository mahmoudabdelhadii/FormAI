/**
 * Community Route
 * This route handles all community related requests
 * @description This router handles GET and PATCH requests for community endpoints
 * @author <your name>
 */
import express,{ Router } from 'express';
import passport from 'passport';
import {getCommunityModerators,addModerator} from "../controllers/admin.controller"

import decodeToken  from '../middleware/auth/decodeToken';
import {
  getCommunities,
  getCommunity,
  createCommunity,
  getMemberCommunities,
  getNotMemberCommunities,
  joinCommunity,
  approveRequest,
  leaveCommunity,
  banUser,
  unbanUser,
  reportPost,
  getReportedPosts,
  removeReportedPost,
  getCommunityMembers,
  getCommunityMods,
  downgradeModerator,
} from '../controllers/community.controller';

const router = Router();
const requireAuth = passport.authenticate('jwt', { session: false });


router.post('/communities',requireAuth, decodeToken, createCommunity);

router.get('/member-communities', requireAuth,decodeToken, getMemberCommunities);
router.get('/not-member-communities',requireAuth, decodeToken, getNotMemberCommunities);

router.post('/communities/:id/join', requireAuth,decodeToken, joinCommunity);

router.post('/requests/:requestId/approve',requireAuth, decodeToken, approveRequest);

router.post('/communities/:id/leave', requireAuth,decodeToken, leaveCommunity);

router.post('/communities/:communityId/ban/:userToBanId',requireAuth, decodeToken, banUser);
router.post('/communities/:communityId/unban/:userToUnbanId', requireAuth,decodeToken, unbanUser);

router.post('/report-post',requireAuth, decodeToken, reportPost);

router.get('/reported-posts/:id',requireAuth, decodeToken, getReportedPosts);
router.delete('/reported-posts/:postId',requireAuth, decodeToken, removeReportedPost);

router.get('/communities/:id/members',requireAuth, decodeToken, getCommunityMembers);
router.get('/communities/:id/mods',requireAuth, decodeToken, getCommunityMods);

router.post('/communities/:communityId/downgrade/:userToDowngradeId',requireAuth, decodeToken, downgradeModerator);


/**
 * GET /communities
 * This endpoint returns a list of all communities
 * @example GET /communities
 * @returns A list of community objects
 */
router.get("/communities", getCommunities);

/**
 * GET /:communityId
 * This endpoint returns the community with the given communityId
 * @example GET /community/1
 * @param {string} communityId The community id to retrieve
 * @returns A community object
 */
router.get("/:communityId", getCommunity);

/**
 * GET /moderators/:communityId
 * This endpoint returns a list of moderators for the given community
 * @example GET /moderators/1
 * @param {string} communityId The community id to retrieve moderators for
 * @returns A list of user objects representing the moderators
 */
router.get("/moderators/:communityId",requireAuth, decodeToken, getCommunityModerators);

/**
 * PATCH /add-moderators
 * This endpoint adds a user as a moderator for the given community
 * @example PATCH /add-moderators
 * @body {
 *   communityId: string,
 *   userId: string
 * }
 * @returns The updated community object
 */
router.patch("/add-moderators",requireAuth, decodeToken, addModerator);

export default router;

