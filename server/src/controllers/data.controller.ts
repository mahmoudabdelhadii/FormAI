import prisma from "../utils/prisma";
import { Request, Response } from 'express';
import generateSignedUrl from "../utils/SignedUrl";
import busboy from 'busboy';
import S3ClientSingleton from '../utils/s3Client'; // Import the S3 client singleton
import { PutObjectCommand } from '@aws-sdk/client-s3';
import stream from 'stream';
const s3 = S3ClientSingleton.getInstance(); 

export const getSignedUrl = async (req: Request, res: Response) => {
    const { objectPath, expireTime } = req.query;
  let signedUrl
  
  try{
    if(expireTime){
  signedUrl = await generateSignedUrl(objectPath as string, parseInt(expireTime as string))
  }
  else {
      signedUrl = await generateSignedUrl(objectPath as string)
  }
  
  res.status(200).json(signedUrl);
  } catch (error) {
    res.status(500).json({ message: "Internal getting signed url" });
  }
  }
  
  
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  
  export const uploadFile = (req: Request, res: Response): void => {
    const bb = busboy({ headers: req.headers, limits: { fileSize: MAX_FILE_SIZE } });
  
    let uploadError: string | null = null;
  
    bb.on('file', (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: string) => {
      const pass = new stream.PassThrough();
      file.pipe(pass);
  
      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        Body: pass,
        ContentType: mimetype,
      };
  
      const uploadCommand = new PutObjectCommand(uploadParams);
  
      s3.send(uploadCommand).then(
        (data) => {
          res.status(201).json({ message: 'File uploaded successfully', data });
        },
        (err) => {
          uploadError = err.message;
          file.resume();
          res.status(400).json({ message: 'File upload failed', error: uploadError });
        }
      );
    });
  
    bb.on('error', (err:any) => {
      uploadError = err.message;
    });
  
    bb.on('finish', () => {
      if (uploadError) {
        res.status(400).json({ message: 'File upload failed', error: uploadError });
      }
    });
  
    req.pipe(bb);
  };