import { Request, Response, NextFunction } from 'express';
import busboy from 'busboy';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import S3ClientSingleton from '../../utils/s3Client';
import stream from 'stream';
import { FileUploadRequest } from '../../types/interfaces';
import prisma from '../../utils/prisma';

const s3 = S3ClientSingleton.getInstance();
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
type FileCategory = 'postsMedia' | 'profilePics' | 'leaderboardEntries' | 'other';

const fileConfig: Record<FileCategory, { allowedTypes: string[]; maxSize: number }> = {
  postsMedia: {
    allowedTypes: ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'],
    maxSize: 10 * 1024 * 1024, // 10 MB
  },
  profilePics: {
    allowedTypes: ['image/jpeg', 'image/png'],
    maxSize: 5 * 1024 * 1024, // 5 MB
  },
  leaderboardEntries: {
    allowedTypes: ['video/mp4', 'video/quicktime'],
    maxSize: 15 * 1024 * 1024, // 15 MB
  },
  other: {
    allowedTypes: [],
    maxSize: 10 * 1024 * 1024, // 10 MB by default
  },
};

export const s3Upload = async (req: FileUploadRequest, res: Response, next: NextFunction): Promise<void> => {
  const fileCategory = req.fileCategory as FileCategory ?? 'other';
  const userFolder = req.userData!.userId || 'default-user';
  const { allowedTypes, maxSize } = fileConfig[fileCategory];

  const bb = busboy({ headers: req.headers, limits: { fileSize: maxSize } });

  let uploadError: string | null = null;

  if (fileCategory === 'profilePics') {
    // Retrieve the current profile picture's key from the database
    const currentProfilePic = await prisma.user.findUnique({
      where: { id: userFolder },
      select: { avatarUrl: true },
    });

    if (currentProfilePic?.avatarUrl) {
      const currentProfilePicKey = currentProfilePic.avatarUrl;

      if (currentProfilePicKey) {
        // Delete the current profile picture from AWS S3
        const deleteParams = {
          Bucket: BUCKET_NAME!,
          Key: currentProfilePicKey,
        };

        try {
          await s3.send(new DeleteObjectCommand(deleteParams));
          console.log('Deleted current profile picture:', currentProfilePicKey);
        } catch (err) {
          console.error('Error deleting current profile picture:', err);
        }
      }
    }
  }

  bb.on('file', (name: string, file: NodeJS.ReadableStream, info) => {
    if (!allowedTypes.includes(info.mimeType)) {
      return res.status(400).json({ message: `Invalid file type for ${fileCategory}. Allowed types: ${allowedTypes.join(', ')}` });
    }

  

    const timestamp = Date.now();
    const filename = `${timestamp}_${info.filename}`;

    const key = `${fileCategory}/${userFolder}/${filename}`;
    const pass = new stream.PassThrough();
    file.pipe(pass);

    const uploadParams = {
      Bucket: BUCKET_NAME!,
      Key: key,
      Body: pass,
      ContentType: info.mimeType,
    };

    console.log('Upload params:', uploadParams);

    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });

    upload.done().then(
      () => {
        req.fileInfo = { filename: filename, location: key, type: info.mimeType }; // Store file info in request
        next(); // Proceed to the next middleware
      },
      (err) => {
        uploadError = err.message;
        file.resume();
        res.status(400).json({ message: 'File upload failed', error: uploadError });
      }
    );
  });

  bb.on('error', (err: any) => {
    uploadError = err.message;
  });

  bb.on('finish', () => {
    if (uploadError) {
      res.status(400).json({ message: 'File upload failed', error: uploadError });
    }
  });

  req.pipe(bb);
};
