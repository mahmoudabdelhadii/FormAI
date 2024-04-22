import express from 'express';
import generateConfirmationToken from "../utils/confirmationToken"
import getCurrentContextData from "../utils/contextData"
import {verifyEmailHTML, verifyLoginHTML} from "../utils/emailTemplates"
import { encryptData, decryptData,} from "../utils/encryption"
import formatCreatedAt from "../utils/timeConverter"

const router = express.Router();

router.get('/', function (req, res, next) {


  res.send(getCurrentContextData(req));
});




export default router;
