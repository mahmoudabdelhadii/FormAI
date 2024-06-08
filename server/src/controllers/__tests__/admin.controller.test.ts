import { Request, Response } from 'express';
import { getCommunityModerators, addModerator, removeModerator } from '../../controllers/admin.controller';
import prisma from '../../utils/prisma';

jest.mock('../../utils/prisma');

describe('Community Controller - Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCommunityModerators', () => {
    it('should return a list of community moderators', async () => {
      const mockRequest = {} as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockModerators = [
        { userId: 'user1', roleId: 2, communityId: 'comm1' },
        { userId: 'user2', roleId: 2, communityId: 'comm1' },
      ];
      (prisma.communityUser.findMany as jest.Mock).mockResolvedValue(mockModerators);

      await getCommunityModerators(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(['user1', 'user2']);
      expect(prisma.communityUser.findMany).toHaveBeenCalledWith({ where: { roleId: 2 } });
    });

    it('should handle errors gracefully', async () => {
      const mockRequest = {} as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (prisma.communityUser.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getCommunityModerators(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error retrieving community moderators' });
    });
  });

  describe('addModerator', () => {
    it('should add a moderator to the community', async () => {
      const mockRequest = {
        query: {
          communityId: 'comm1',
          moderatorId: 'user1',
        },
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockCommunityUser = { userId: 'user1', roleId: 3, communityId: 'comm1' };
      (prisma.communityUser.findUnique as jest.Mock).mockResolvedValue(mockCommunityUser);
      (prisma.communityUser.update as jest.Mock).mockResolvedValue({ ...mockCommunityUser, roleId: 2 });

      await addModerator(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Moderator added' });
      expect(prisma.communityUser.update).toHaveBeenCalledWith({
        where: { userId_communityId: { communityId: 'comm1', userId: 'user1' } },
        data: { roleId: 2 },
      });
    });

    it('should return 404 if the community user is not found', async () => {
      const mockRequest = {
        query: {
          communityId: 'comm1',
          moderatorId: 'user1',
        },
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (prisma.communityUser.findUnique as jest.Mock).mockResolvedValue(null);

      await addModerator(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'CommunityUser not found' });
    });

    it('should return 400 if the user is already a moderator', async () => {
      const mockRequest = {
        query: {
          communityId: 'comm1',
          moderatorId: 'user1',
        },
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockCommunityUser = { userId: 'user1', roleId: 2, communityId: 'comm1' };
      (prisma.communityUser.findUnique as jest.Mock).mockResolvedValue(mockCommunityUser);

      await addModerator(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Already a moderator' });
    });

    it('should handle errors gracefully', async () => {
      const mockRequest = {
        query: {
          communityId: 'comm1',
          moderatorId: 'user1',
        },
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (prisma.communityUser.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await addModerator(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error adding moderator' });
    });
  });

  describe('removeModerator', () => {
    it('should remove a moderator from the community', async () => {
      const mockRequest = {
        query: {
          communityId: 'comm1',
          moderatorId: 'user1',
        },
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockCommunityUser = { userId: 'user1', roleId: 2, communityId: 'comm1' };
      (prisma.communityUser.findUnique as jest.Mock).mockResolvedValue(mockCommunityUser);
      (prisma.communityUser.update as jest.Mock).mockResolvedValue({ ...mockCommunityUser, roleId: 3 });

      await removeModerator(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Moderator removed' });
      expect(prisma.communityUser.update).toHaveBeenCalledWith({
        where: { userId_communityId: { communityId: 'comm1', userId: 'user1' } },
        data: { roleId: 3 },
      });
    });

    it('should return 404 if the community user is not found', async () => {
      const mockRequest = {
        query: {
          communityId: 'comm1',
          moderatorId: 'user1',
        },
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (prisma.communityUser.findUnique as jest.Mock).mockResolvedValue(null);

      await removeModerator(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'CommunityUser not found' });
    });

    it('should return 400 if the user is not a moderator', async () => {
      const mockRequest = {
        query: {
          communityId: 'comm1',
          moderatorId: 'user1',
        },
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockCommunityUser = { userId: 'user1', roleId: 3, communityId: 'comm1' };
      (prisma.communityUser.findUnique as jest.Mock).mockResolvedValue(mockCommunityUser);

      await removeModerator(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Not a moderator' });
    });

    it('should handle errors gracefully', async () => {
      const mockRequest = {
        query: {
          communityId: 'comm1',
          moderatorId: 'user1',
        },
      } as unknown as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (prisma.communityUser.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await removeModerator(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error removing moderator' });
    });
  });
});
