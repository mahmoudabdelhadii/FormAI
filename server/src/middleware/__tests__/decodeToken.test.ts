import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import decodeToken from '../auth/decodeToken'; // Adjust the path based on your project structure

jest.mock('jsonwebtoken');

describe('decodeToken middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {}, // Ensure headers is always defined
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should return 401 if Authorization header is missing', () => {
    const req = mockRequest as Request;
    const res = mockResponse as Response;
    const next = mockNext;

    decodeToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authorization header is missing' });
  });

  it('should return 401 if token is missing', () => {
    mockRequest.headers!.authorization = 'Bearer '; // Non-null assertion operator
    const req = mockRequest as Request;
    const res = mockResponse as Response;
    const next = mockNext;

    decodeToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is missing' });
  });

  it('should return 401 if token verification fails', () => {
    mockRequest.headers!.authorization = 'Bearer invalid_token'; // Non-null assertion operator
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Unauthorized');
    });
    const req = mockRequest as Request;
    const res = mockResponse as Response;
    const next = mockNext;

    decodeToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should call next if token verification succeeds', () => {
    const mockDecodedToken = { id: '123', email: 'test@example.com' };
    mockRequest.headers!.authorization = 'Bearer valid_token'; // Non-null assertion operator
    (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);
    const req = mockRequest as Request;
    const res = mockResponse as Response;
    const next = mockNext;

    decodeToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid_token', process.env.JWT_SECRET as string);
    expect(req.user).toEqual({ userId: mockDecodedToken.id, email: mockDecodedToken.email });
    expect(next).toHaveBeenCalled();
  });
});
