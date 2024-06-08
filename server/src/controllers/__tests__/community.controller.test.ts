import { Request, Response } from 'express';
import { mockDeep } from 'jest-mock-extended';
import prisma from '../../utils/prisma';
import * as communityController from '../../controllers/community.controller';

jest.mock('../../utils/prisma');

const mockRequest = (params = {}, body = {}, query = {}, user = {}) => ({
  params,
  body,
  query,
  userData: user,
} as Partial<Request>);

const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Community Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCommunities', () => {
    it('should return all communities', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (prisma.community.findMany as jest.MockedFunction<typeof prisma.community.findMany>).mockResolvedValue([
        { id: '1', name: 'Community 1', description: 'Community 1 description' },
      ]);

      await communityController.getCommunities(req as Request, res as Response);

      expect(prisma.community.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: '1', name: 'Community 1' }]);
    });

    it('should handle errors', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (prisma.community.findMany as jest.MockedFunction<typeof prisma.community.findMany>).mockRejectedValue(new Error('Error'));

      await communityController.getCommunities(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No communities found' });
    });
  });

  describe('getCommunity', () => {
    it('should return a community by ID', async () => {
      const req = mockRequest({ id: '1' });
      const res = mockResponse();

      (prisma.community.findUnique as jest.MockedFunction<typeof prisma.community.findUnique>).mockResolvedValue({
        id: '1',
        name: 'Community 1',
        description: 'Community 1 description',
      });

      await communityController.getCommunity(req as Request, res as Response);

      expect(prisma.community.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { CommunityRequests: true, CommunityUsers: true, BannedUsers: true },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: '1',
        name: 'Community 1',
        CommunityRequests: [],
        CommunityUsers: [],
        BannedUsers: [],
      });
    });

    it('should handle errors', async () => {
      const req = mockRequest({ id: '1' });
      const res = mockResponse();

      (prisma.community.findUnique as jest.MockedFunction<typeof prisma.community.findUnique>).mockRejectedValue(new Error('Error'));

      await communityController.getCommunity(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Community not found' });
    });
  });

  describe('createCommunity', () => {
    it('should create communities', async () => {
      const req = mockRequest({}, [{ name: 'Community 1' }]);
      const res = mockResponse();

      (prisma.community.createMany as jest.MockedFunction<typeof prisma.community.createMany>).mockResolvedValue({
        count: 1,
      });

      await communityController.createCommunity(req as Request, res as Response);

      expect(prisma.community.createMany).toHaveBeenCalledWith({
        data: [{ name: 'Community 1' }],
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ count: 1 });
    });

    it('should handle errors', async () => {
      const req = mockRequest({}, [{ name: 'Community 1' }]);
      const res = mockResponse();

      (prisma.community.createMany as jest.MockedFunction<typeof prisma.community.createMany>).mockRejectedValue(new Error('Error'));

      await communityController.createCommunity(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating community' });
    });
  });

  describe('getMemberCommunities', () => {
    it('should return communities for a member', async () => {
      const req = mockRequest({ userId: '1' });
      const res = mockResponse();

      (prisma.community.findMany as jest.MockedFunction<typeof prisma.community.findMany>).mockResolvedValue([
        { id: '1', name: 'Community 1', description: 'Description' },
      ]);

      await communityController.getMemberCommunities(req as Request, res as Response);

      expect(prisma.community.findMany).toHaveBeenCalledWith({
        where: { CommunityUsers: { some: { userId: '1' } } },
        select: {
          id: true,
          name: true,
          CommunityUsers: { select: { id: true } },
          description: true,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: '1', name: 'Community 1', description: 'Description', CommunityUsers: [{ id: '1' }] },
      ]);
    });

    it('should handle errors', async () => {
      const req = mockRequest({ userId: '1' });
      const res = mockResponse();

      (prisma.community.findMany as jest.MockedFunction<typeof prisma.community.findMany>).mockRejectedValue(new Error('Error'));

      await communityController.getMemberCommunities(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error getting communities' });
    });
  });

  describe('getNotMemberCommunities', () => {
    it('should return communities not joined by a member', async () => {
      const req = mockRequest({ userId: '1' });
      const res = mockResponse();

      (prisma.community.findMany as jest.MockedFunction<typeof prisma.community.findMany>).mockResolvedValue([
        { id: '1', name: 'Community 1', description: 'Description' },
      ]);

      await communityController.getNotMemberCommunities(req as Request, res as Response);

      expect(prisma.community.findMany).toHaveBeenCalledWith({
        where: {
          NOT: {
            CommunityUsers: { some: { userId: '1' } },
          },
          BannedUsers: { none: { userId: '1' } },
        },
        select: {
          id: true,
          name: true,
          description: true,
          CommunityUsers: { select: { id: true } },
        },
        orderBy: { CommunityUsers: { _count: 'desc' } },
        take: 10,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: '1', name: 'Community 1', description: 'Description', CommunityUsers: [{ id: '1' }] },
      ]);
    });

    it('should handle errors', async () => {
      const req = mockRequest({ userId: '1' });
      const res = mockResponse();

      (prisma.community.findMany as jest.MockedFunction<typeof prisma.community.findMany>).mockRejectedValue(new Error('Error'));

      await communityController.getNotMemberCommunities(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error getting communities' });
    });
  });

  // Add similar tests for the remaining functions...
});
