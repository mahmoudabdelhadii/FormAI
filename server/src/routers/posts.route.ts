import { Router } from 'express';
import passport from 'passport';
import {
  getPublicPosts,
  getPosts,
  getPost,
  addPost,
//   confirmPost,
//   rejectPost,
  deletePost,
  getCommunityPosts,
  getFollowingUsersPosts,
  likePost,
  unlikePost,
  addComment,
//   savePost,
//   unsavePost,
//   getSavedPosts,
//   clearPendingPosts,
} from '../controllers/post.controller';
import {
  postValidator,
  commentValidator,
} from '../middleware/validators/validator';
import {
  createPostLimiter,
  likeSaveLimiter,
  commentLimiter,
} from '../middleware/limiter/limiter';

// import postConfirmation from '../middlewares/post/postConfirmation.js';
// import analyzeContent from '../services/analyzeContent.js';
// import processPost from '../services/processPost.js';
import {s3Upload} from '../middleware/posts/dataUpload';
import decodeToken from '../middleware/auth/decodeToken';
import { setFileCategory } from '../middleware/setCatagory';

const router = Router();
const requireAuth = passport.authenticate('jwt', { session: false });

// router.use(requireAuth);
// router.use(decodeToken);

router.get('/community/:communityId',requireAuth,
decodeToken, getCommunityPosts);

router.get('/:publicUserId/userPosts', requireAuth,
decodeToken,getPublicPosts);
router.get('/:id/following', requireAuth,
decodeToken,getFollowingUsersPosts);
router.get('/:id',requireAuth,
decodeToken, getPost);
router.get('/', requireAuth,
decodeToken,getPosts);

// router.post('/confirm/:confirmationToken', confirmPost);
// router.post('/reject/:confirmationToken', rejectPost);

router.post(
  '/:id/comment',
  commentLimiter,
  requireAuth,
  decodeToken,
  commentValidator,
  addComment
);

router.post(
  '/',
  createPostLimiter,
  requireAuth,
  decodeToken,
  setFileCategory,
  s3Upload,
  // postValidator,
  addPost
);

// router.delete('/pending', clearPendingPosts);
router.delete('/:id', requireAuth,
decodeToken, deletePost);

router.use(likeSaveLimiter);
router.patch('/:id/like', requireAuth,
decodeToken, likePost);
router.patch('/:id/unlike', requireAuth,
decodeToken, unlikePost);

export default router;
