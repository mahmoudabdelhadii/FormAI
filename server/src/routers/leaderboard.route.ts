import { Router } from 'express';
import {
  createLeaderboard,
  addSubmission,
  getLeaderboardSubmissions,
  getCommunityLeaderboards,
  verifySubmission,
  deleteLeaderboard,
} from '../controllers/leaderboard.controller';

const router = Router();

// Create a new leaderboard for a community
router.post('/', createLeaderboard);

// Add a submission to a leaderboard
router.post('/submission', addSubmission);

// Get all submissions for a specific leaderboard
router.get('/:leaderboardId/submissions', getLeaderboardSubmissions);

// Get all leaderboards for a specific community
router.get('/community/:communityId', getCommunityLeaderboards);

// Verify a submission
router.patch('/submission/:submissionId/verify', verifySubmission);

// Delete a leaderboard
router.delete('/:leaderboardId', deleteLeaderboard);

export default router;
