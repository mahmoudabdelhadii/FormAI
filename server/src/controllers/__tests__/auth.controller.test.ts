import { Request, Response } from 'express';
import prisma from '../../utils/prisma';
import {
  verifyContextData,
  getUserPreferences,
  addContextData,
  getAuthContextData,
  getTrustedAuthContextData,
  getBlockedAuthContextData,
  deleteContextAuthData,
  blockContextAuthData,
  unblockContextAuthData,
  types
} from '../../controllers/auth.controller';
import getCurrentContextData from '../../utils/contextData';

jest.mock('../../utils/prisma');
jest.mock('../../utils/contextData');

describe('Auth Controller Unit Tests', () => {
  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyContextData', () => {
    it('should return NO_CONTEXT_DATA when no context data is found for the user', async () => {
      const mockRequest = { userData: { id: 'user1' } } as any as Request;
      (prisma.context.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await verifyContextData(mockRequest, { id: 'user1' });

      expect(result).toBe(types.NO_CONTEXT_DATA);
      expect(prisma.context.findUnique).toHaveBeenCalledWith({ where: { userId: 'user1' } });
    });

    // TODO:Add more test cases for other scenarios...

    it('should return ERROR when an exception occurs', async () => {
      const mockRequest = { userData: { id: 'user1' } } as any as Request;
      (prisma.context.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      const result = await verifyContextData(mockRequest, { id: 'user1' });

      expect(result).toBe(types.ERROR);
    });
  });

  describe('getUserPreferences', () => {
    it('should return user preferences if they exist', async () => {
      const mockRequest = { userData: { userId: 'user1' } } as any as Request;
      const mockRes = mockResponse();
      const mockPreferences = { userId: 'user1', enableContextBasedAuth: true };

      (prisma.preferences.findUnique as jest.Mock).mockResolvedValue(mockPreferences);

      await getUserPreferences(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPreferences);
    });

    it('should return 404 if user preferences do not exist', async () => {
      const mockRequest = { userData: { userId: 'user1' } } as any as Request;
      const mockRes = mockResponse();

      (prisma.preferences.findUnique as jest.Mock).mockResolvedValue(null);

      await getUserPreferences(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not found' });
    });

    it('should handle errors and return 500', async () => {
      const mockRequest = { userData: { userId: 'user1' } } as any as Request;
      const mockRes = mockResponse();

      (prisma.preferences.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getUserPreferences(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('addContextData', () => {
    it('should add or update context data successfully', async () => {
      const mockRequest = { userData: { userId: 'user1' } } as any as Request;
      const mockRes = mockResponse();
      const mockContextData = { ip: '127.0.0.1' };

      (getCurrentContextData as jest.Mock).mockReturnValue(mockContextData);

      await addContextData(mockRequest, mockRes);

      expect(prisma.context.upsert).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        update: { ...mockContextData },
        create: { userId: 'user1', ...mockContextData },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Context data added/updated successfully' });
    });

    it('should handle errors and return 500', async () => {
      const mockRequest = { userData: { userId: 'user1' } } as any as Request;
      const mockRes = mockResponse();

      (prisma.context.upsert as jest.Mock).mockRejectedValue(new Error('Database error'));

      await addContextData(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getAuthContextData', () => {
    it('should return user context data if it exists', async () => {
      const mockRequest = { userData: { userId: 'user1' } } as any as Request;
      const mockRes = mockResponse();
      const mockContextData = { ip: '127.0.0.1' };

      (prisma.context.findUnique as jest.Mock).mockResolvedValue(mockContextData);

      await getAuthContextData(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockContextData);
    });

    it('should return 404 if user context data does not exist', async () => {
      const mockRequest = { userData: { userId: 'user1' } } as any as Request;
      const mockRes = mockResponse();

      (prisma.context.findUnique as jest.Mock).mockResolvedValue(null);

      await getAuthContextData(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not found' });
    });

    it('should handle errors and return 500', async () => {
      const mockRequest = { userData: { userId: 'user1' } } as any as Request;
      const mockRes = mockResponse();

      (prisma.context.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getAuthContextData(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getTrustedAuthContextData', () => {
    it('should return trusted context data', async () => {
      const mockRequest = { userData: { userId: 'user1' } } as any as Request;
      const mockRes = mockResponse();
      const mockTrustedData = [{ id: '1', ip: '127.0.0.1', isTrusted: true, isBlocked: false }];

      (prisma.suspiciousLogin.findMany as jest.Mock).mockResolvedValue(mockTrustedData);

      await getTrustedAuthContextData(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ ip: '127.0.0.1' })]));
    });

    it('should handle errors and return 500', async () => {
      const mockRequest = { userData: { userId: 'user1' } } as any as Request;
      const mockRes = mockResponse();

      (prisma.suspiciousLogin.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getTrustedAuthContextData(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getBlockedAuthContextData', () => {
    it('should return blocked context data', async () => {
      const mockRequest = { userData: { userId: 'user1' } } as any as Request;
      const mockRes = mockResponse();
      const mockBlockedData = [{ id: '1', ip: '127.0.0.1', isBlocked: true, isTrusted: false }];

      (prisma.suspiciousLogin.findMany as jest.Mock).mockResolvedValue(mockBlockedData);

      await getBlockedAuthContextData(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ ip: '127.0.0.1' })]));
    });

    it('should handle errors and return 500', async () => {
      const mockRequest = { userData: { userId: 'user1' } } as any as Request;
      const mockRes = mockResponse();

      (prisma.suspiciousLogin.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getBlockedAuthContextData(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('deleteContextAuthData', () => {
    it('should delete context auth data successfully', async () => {
      const mockRequest = { params: { contextId: '1' } } as any as Request;
      const mockRes = mockResponse();

      await deleteContextAuthData(mockRequest, mockRes);

      expect(prisma.suspiciousLogin.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Data deleted successfully' });
    });

    it('should handle errors and return 500', async () => {
      const mockRequest = { params: { contextId: '1' } } as any as Request;
      const mockRes = mockResponse();

      (prisma.suspiciousLogin.delete as jest.Mock).mockRejectedValue(new Error('Database error'));

      await deleteContextAuthData(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('blockContextAuthData', () => {
    it('should block context auth data successfully', async () => {
      const mockRequest = { params: { contextId: '1' } } as any as Request;
      const mockRes = mockResponse();

      await blockContextAuthData(mockRequest, mockRes);

      expect(prisma.suspiciousLogin.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isBlocked: true, isTrusted: false },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Blocked successfully' });
    });

    it('should handle errors and return 500', async () => {
      const mockRequest = { params: { contextId: '1' } } as any as Request;
      const mockRes = mockResponse();

      (prisma.suspiciousLogin.update as jest.Mock).mockRejectedValue(new Error('Database error'));

      await blockContextAuthData(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('unblockContextAuthData', () => {
    it('should unblock context auth data successfully', async () => {
      const mockRequest = { params: { contextId: '1' } } as any as Request;
      const mockRes = mockResponse();

      await unblockContextAuthData(mockRequest, mockRes);

      expect(prisma.suspiciousLogin.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isBlocked: false, isTrusted: true },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unblocked successfully' });
    });

    it('should handle errors and return 500', async () => {
      const mockRequest = { params: { contextId: '1' } } as any as Request;
      const mockRes = mockResponse();

      (prisma.suspiciousLogin.update as jest.Mock).mockRejectedValue(new Error('Database error'));

      await unblockContextAuthData(mockRequest, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
