import express from 'express';
import generateConfirmationToken from "../utils/confirmationToken"
import getCurrentContextData from "../utils/contextData"
import {verifyEmailHTML, verifyLoginHTML} from "../utils/emailTemplates"
import { encryptData, decryptData,} from "../utils/encryption"
import formatCreatedAt from "../utils/timeConverter"
import {getCommunity,getCommunities,getModerators,addModerator, getSignedUrl} from '../controllers/community.controller'

const router = express.Router();

router.get("/:communityId", getCommunity);
router.get("/communities", getCommunities);


router.get("/moderators/:communityId", getModerators);

router.post("/geturl", getSignedUrl);

router.patch("/add-moderators", addModerator);
export default router;
