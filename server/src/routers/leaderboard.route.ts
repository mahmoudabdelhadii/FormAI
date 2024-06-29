import { Router } from 'express';
import {
  createLeaderboard,
  addSubmission,
  getLeaderboardSubmissions,
  getCommunityLeaderboards,
  verifySubmission,
  deleteLeaderboard,
  deleteEntry
} from '../controllers/leaderboard.controller';
import passport from 'passport';
import decodeToken from '../middleware/auth/decodeToken';
import { setFileCategory } from '../middleware/setCatagory';
import { s3Upload } from '../middleware/posts/dataUpload';
const router = Router();
const requireAuth = passport.authenticate('jwt', { session: false });
// Create a new leaderboard for a community
router.post('/', createLeaderboard);

// Add a submission to a leaderboard
router.post(':leaderboardId/submission',requireAuth,
decodeToken,setFileCategory,
s3Upload, addSubmission);

// Get all submissions for a specific leaderboard
router.get('/:leaderboardId/submissions', getLeaderboardSubmissions);

// Get all leaderboards for a specific community
router.get('/community/:communityId', getCommunityLeaderboards);

// Verify a submission
router.patch('/submission/:submissionId/verify', verifySubmission);

// Delete a leaderboard
router.delete('/:leaderboardId', deleteLeaderboard);
router.delete('/submission/:id', requireAuth, decodeToken, deleteEntry);

export default router;
