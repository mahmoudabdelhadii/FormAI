/**
 * Module containing the router for the /auth endpoints
 *
 * @module server/src/routers/auth.route.ts
 */

import express from 'express';

/**
 * Controller responsible for handling file upload and signing URLs
 * @module ../controllers/data.controller
 */
import { getSignedUrl, uploadFile } from "../controllers/data.controller"

/**
 * Express router instance for the /auth endpoints
 * @type {import('express').Router}
 */
const router = express.Router();

/**
 * GET /getsignedurl
 * - Return a signed URL for a resource that can be used to upload a file
 * - The URL is valid for 10 minutes
 * @returns {Promise<string>}
 * - A signed URL
 */
router.get("/getsignedurl", getSignedUrl);

/**
 * POST /upload
 * - Upload a file to AWS S3
 * - The file is saved in a bucket with the same name as the user's ID
 * @param {import('express').Request} req - The request object
 * @param {import('express').Response} res - The response object
 * @param {import('express').NextFunction} next - The next function in the middleware chain
 */
router.post('/upload', uploadFile);




/**
 * Export the router instance
 * @type {import('express').Router}
 */
export default router;
