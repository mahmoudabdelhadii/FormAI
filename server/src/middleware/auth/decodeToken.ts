import { Response, NextFunction,RequestHandler, Request } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken, DecodedRequest } from '../../types/interfaces';

/**
 * Middleware to decode and verify a JWT token in the Authorization header
 * The middleware checks if the token is present and verifies it with the secret key
 * If the verification is successful, the user data is stored in the request object
 * and the next function is called to continue with the request
 * If the verification fails, a 401 Unauthorized response is sent
 */
const decodeToken: RequestHandler = (req: DecodedRequest, res: Response, next: NextFunction) :void=> {
 
  const authHeader = req.headers.authorization;

  
  if (!authHeader) {
     res.status(401).json({ message: 'Authorization header is missing' });
     return;
  }

  
  const token = authHeader.split(' ')[1];

  
  if (!token) {
     res.status(401).json({ message: 'Token is missing' });
     return;
  }

 
  try {
    const decoded = jwt.verify(token, process.env.SECRET as string) as DecodedToken;
    req.userData = { userId: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export default decodeToken;
