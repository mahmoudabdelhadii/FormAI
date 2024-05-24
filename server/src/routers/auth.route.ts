import express from 'express';

import {getSignedUrl} from "../controllers/admin.controller"
import {verifyEmailHTML} from "../utils/emailTemplates"
const router = express.Router();

const verifyemail = (req:any,res:any)=>{
    const email = verifyEmailHTML("mahmoud", "mahmoud", 123)
   return res.status(200).send(email)
}
router.get("/getsignedurl", getSignedUrl);

router.get("/verifytest", verifyemail)

router

export default router;