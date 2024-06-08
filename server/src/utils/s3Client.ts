import { S3Client } from '@aws-sdk/client-s3';

class S3ClientSingleton {
  private static instance: S3Client;

  private constructor() {}

  public static getInstance(): S3Client {
    if (!S3ClientSingleton.instance) {
      S3ClientSingleton.instance = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });
    }
    return S3ClientSingleton.instance;
  }
}

export default S3ClientSingleton;