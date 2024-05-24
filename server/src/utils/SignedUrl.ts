import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { readFileSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

/**
 * Generates a signed URL for accessing a CloudFront-distributed S3 object.
 * 
 * @param {string} objectPath - The path to the object in the CloudFront distribution.
 * @param {number} [expireTime=3600] - The expiration time for the URL in seconds.
 * @returns {string} - The signed URL.
 */
const generateSignedUrl = async(objectPath: string, expireTime: number = 3600): Promise<string> => {
  const domain = process.env.CLOUDFRONT_DOMAIN; // Hard-coded CloudFront domain
  const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID; // Key pair ID from environment variable
  const privateKeyPath = process.env.CLOUDFRONT_PRIVATE_KEY_PATH; // Path to the private key file from environment variable
  const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY; // Private key from environment variable

  if (!keyPairId) {
    throw new Error('Environment variable CLOUDFRONT_KEY_PAIR_ID must be set.');
  }

  let privateKeyContent = privateKey;
  if (!privateKeyContent) {
    if (!privateKeyPath) {
      throw new Error('Environment variables CLOUDFRONT_PRIVATE_KEY or CLOUDFRONT_PRIVATE_KEY_PATH must be set.');
    }
    privateKeyContent = readFileSync(resolve(privateKeyPath), 'utf8');
  }

  const signedUrl = getSignedUrl({
    url: `https://${domain}/${objectPath}`,
    keyPairId: keyPairId,
    privateKey: privateKeyContent,
    dateLessThan: "2024-06-01", // Current time in seconds + expireTime
  });

  return signedUrl;
};

export default generateSignedUrl;
