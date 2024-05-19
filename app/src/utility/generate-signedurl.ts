// generateSignedUrl.ts
import crypto from 'crypto';

const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN as string;
const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID as string;
const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY?.replace(/\\n/g, '\n') as string;

const generateSignedUrl = (fileName: string, expiresIn: number = 3600): string => {
  const policy = JSON.stringify({
    Statement: [
      {
        Resource: `https://${cloudFrontDomain}/${fileName}`,
        Condition: {
          DateLessThan: {
            'AWS:EpochTime': Math.floor(Date.now() / 1000) + expiresIn,
          },
        },
      },
    ],
  });

  const policyBase64 = Buffer.from(policy).toString('base64');
  const signature = crypto.createSign('SHA256').update(policyBase64).sign(privateKey, 'base64');

  const signedUrl = `https://${cloudFrontDomain}/${fileName}?Policy=${encodeURIComponent(
    policyBase64
  )}&Signature=${encodeURIComponent(signature)}&Key-Pair-Id=${keyPairId}`;

  return signedUrl;
};

export default generateSignedUrl;
