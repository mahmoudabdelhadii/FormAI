// src/middleware/useragentMiddleware.ts
import useragent from 'express-useragent';
import { Request, Response, NextFunction } from 'express';

export const useragentMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.useragent = useragent.parse(req.headers['user-agent']|| '');
  next();
};
