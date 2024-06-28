import { Request, Response, NextFunction } from 'express';
import {  FileUploadRequest } from '../types/interfaces';

export const setFileCategory = (req: FileUploadRequest, res: Response, next: NextFunction): any => {
  let fileCategory = '';
  if (req.originalUrl.startsWith('/post')) {
    fileCategory = 'postsMedia';
  } else if (req.originalUrl.startsWith('/user')) {
    fileCategory = 'profilePics';
  } else if (req.originalUrl.startsWith('/leaderboard')) {
    fileCategory = 'leaderboardEntries';
  } else {
    return res.status(400).json({ message: 'Invalid file upload path' });
  }

  req.fileCategory = fileCategory;
  next();
};
