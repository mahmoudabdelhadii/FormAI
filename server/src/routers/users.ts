import express from 'express';
import generateConfirmationToken from "../utils/confirmationToken"
import getCurrentContextData from "../utils/contextData"
import {verifyEmailHTML, verifyLoginHTML} from "../utils/emailTemplates"
import { encryptData, decryptData,} from "../utils/encryption"
import formatCreatedAt from "../utils/timeConverter"
import {getCommunity,getCommunities,getModerators,addModerator} from '../controllers/admin.controller'
const router = express.Router();

router.get("/community/:communityId", getCommunity);
router.get("/communities", getCommunities);


router.get("/moderators/:communityId", getModerators);

router.patch("/add-moderators", addModerator);
export default router;
