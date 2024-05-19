import { PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import s3 from '../../aws-config';

const uploadToS3 = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}-${file.name}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: fileName,
    Body: file,
    ContentType: file.type,
    ACL: 'private' as ObjectCannedACL, // Explicitly define the ACL type
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return fileName; // Return the S3 object key
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default uploadToS3;
