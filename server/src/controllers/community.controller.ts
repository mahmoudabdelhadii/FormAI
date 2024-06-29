import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DecodedRequest } from '../types/interfaces';
dayjs.extend(relativeTime);

const isAdminOrModerator = async (userId: string, communityId: string) => {
  const userRole = await prisma.communityUser.findUnique({
    where: { userId_communityId: { userId, communityId } },
    select: { roleId: true },
  });
  return userRole?.roleId === 1 || userRole?.roleId === 2;
};

export const getCommunities = async (req: Request, res: Response) => {
  try {
    const communities = await prisma.community.findMany();
    res.status(200).json(communities);
  } catch (error) {
    res.status(404).json({ message: "No communities found" });
  }
};

export const getCommunity = async (req: Request, res: Response) => {
  try {
    const community = await prisma.community.findUnique({
      where: { id: req.params.id },
      include: { CommunityRequests: true, CommunityUsers: true, BannedUsers: true },
    });
    res.status(200).json(community);
  } catch (error) {
    res.status(404).json({ message: "Community not found" });
  }
};

export const createCommunity = async (req: DecodedRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.userData!.userId;

    const community = await prisma.community.create({
      data: {
        name,
        description,
        CommunityUsers: {
          create: {
            userId,
            roleId: 1, // Set the creator as admin
          },
        },
      },
    });
    res.status(201).json(community);
  } catch (error) {
    res.status(409).json({ message: "Error creating community" });
  }
};

export const getMemberCommunities = async (req: Request, res: Response) => {
  try {
    const communities = await prisma.community.findMany({
      where: { CommunityUsers: { some: { userId: req.params.userId } } },
      select: {
        id: true,
        name: true,
        CommunityUsers: { select: { id: true } },
        description: true,
      },
    });
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ message: "Error getting communities" });
  }
};

export const getNotMemberCommunities = async (req: Request, res: Response) => {
  try {
    const communities = await prisma.community.findMany({
      where: {
        NOT: {
          CommunityUsers: { some: { userId: req.params.userId } },
        },
        BannedUsers: { none: { userId: req.params.userId } },
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
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ message: "Error getting communities" });
  }
};

export const joinCommunity = async (req: DecodedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const community = await prisma.community.update({
      where: { id },
      data: {
        CommunityRequests: { create: { userId: req.userData!.userId, requestedAt: new Date() } },
      },
    });

    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ message: "Error joining community" });
  }
};

export const approveRequest = async (req: DecodedRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    const userId = req.userData!.userId;

    const request = await prisma.communityRequest.findUnique({
      where: { id: requestId },
      include: { Community: true },
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (!(await isAdminOrModerator(userId, request.communityId))) {
      return res.status(403).json({ message: "You are not authorized to approve requests" });
    }

    const community = await prisma.community.update({
      where: { id: request.communityId },
      data: {
        CommunityUsers: { create: { userId: request.userId, roleId: 3 } },
        CommunityRequests: { delete: { id: requestId } },
      },
    });

    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ message: "Error approving request" });
  }
};

export const leaveCommunity = async (req: DecodedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const community = await prisma.community.update({
      where: { id },
      data: {
        CommunityUsers: { deleteMany: { userId: req.userData!.userId } },
      },
    });
    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ message: "Error leaving community" });
  }
};

export const banUser = async (req: DecodedRequest, res: Response) => {
  try {
    const { userId, communityId } = req.params;
    const requesterId = req.userData!.userId;

    if (!(await isAdminOrModerator(requesterId, communityId))) {
      return res.status(403).json({ message: "You are not authorized to ban users" });
    }

    const community = await prisma.community.update({
      where: { id: communityId },
      data: {
        CommunityUsers: { deleteMany: { userId } },
        BannedUsers: { create: { userId, reason: "Violation of rules" } },
      },
    });

    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ message: "Error banning user from community" });
  }
};

export const unbanUser = async (req: DecodedRequest, res: Response) => {
  try {
    const { userId, communityId } = req.params;
    const requesterId = req.userData!.userId;

    if (!(await isAdminOrModerator(requesterId, communityId))) {
      return res.status(403).json({ message: "You are not authorized to unban users" });
    }

    const community = await prisma.community.update({
      where: { id: communityId },
      data: {
        BannedUsers: { deleteMany: { userId } },
      },
    });
    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ message: "Error unbanning user from community" });
  }
};

export const reportPost = async (req: Request, res: Response) => {
  try {
    const { postId, reportReason, communityId } = req.body.info;

    if (!postId || !reportReason) {
      return res.status(400).json({ message: "Invalid data. postId and reportReason are required." });
    }

    const reportedPost = await prisma.report.findFirst({ where: { postId } });

    if (reportedPost) {
      if (reportedPost.reportedBy.includes(req.params.userId)) {
        return res.status(400).json({ message: "You have already reported this post." });
      }

      await prisma.report.update({
        where: { id: reportedPost.id },
        data: { reportedBy: req.params.userId },
      });

      return res.status(200).json(reportedPost);
    }

    const report = await prisma.report.create({
      data: {
        postId,
        communityId,
        reportedBy: req.params.userId,
        reportReason,
        reportDate: new Date(),
      },
    });

    res.status(200).json({ message: "Post reported successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error reporting post" });
  }
};

export const getReportedPosts = async (req: Request, res: Response) => {
  try {
    const communityId = req.params.id;
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true },
    });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const reportedPosts = await prisma.report.findMany({
      where: { communityId: community.id },
      include: {
        Post: {
          select: { id: true, content: true, fileUrl: true, createdAt: true, userId: true },
        },
        User: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
      orderBy: { reportDate: 'desc' },
    });

    const formattedReportedPosts = reportedPosts.map(post => ({
      ...post,
      reportDate: dayjs(post.reportDate).fromNow(),
    }));

    res.status(200).json({ formattedReportedPosts });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while retrieving the reported posts" });
  }
};

export const removeReportedPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    await prisma.report.deleteMany({
      where: { postId },
    });

    res.status(200).json({ message: "Reported post removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCommunityMembers = async (req: Request, res: Response) => {
  try {
    const communityId = req.params.id;
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        CommunityUsers: {
          where: { roleId: 3 },
          select: { User: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, createdAt: true } } },
        },
        BannedUsers: {
          select: { User: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, createdAt: true} } },
        },
      },
    });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const members = community.CommunityUsers.map(cu => cu.User);
    const bannedUsers = community.BannedUsers.map(bu => bu.User);

    res.status(200).json({ members, bannedUsers });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCommunityMods = async (req: Request, res: Response) => {
  try {
    const communityId = req.params.id;
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        CommunityUsers: {
          where: { roleId: 2 },
          select: { User: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, createdAt: true } } },
        },
      },
    });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const moderators = community.CommunityUsers.map(cu => cu.User);

    res.status(200).json(moderators);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const downgradeModerator = async (req: DecodedRequest, res: Response) => {
  try {
    const { communityId, userId } = req.params;
    const requesterId = req.userData!.userId;

    const requesterRole = await prisma.communityUser.findUnique({
      where: { userId_communityId: { userId: requesterId, communityId } },
      select: { roleId: true },
    });

    if (requesterRole?.roleId !== 1) {
      return res.status(403).json({ message: "You are not authorized to downgrade moderators" });
    }

    const updatedUser = await prisma.communityUser.update({
      where: { userId_communityId: { userId, communityId } },
      data: { roleId: 3 },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error downgrading moderator" });
  }
};
