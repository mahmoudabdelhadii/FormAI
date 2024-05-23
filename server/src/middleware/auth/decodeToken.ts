import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

const decodeToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET as string) as DecodedToken;
    req.params.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export default decodeToken;
