import express from 'express';

import {getCommunity,getCommunities} from '../controllers/community.controller'
import {getModerators,addModerator, getSignedUrl} from "../controllers/admin.controller"

const router = express.Router();

router.get("/:communityId", getCommunity);
router.get("/communities", getCommunities);


router.get("/moderators/:communityId", getModerators);



router.patch("/add-moderators", addModerator);
export default router;
