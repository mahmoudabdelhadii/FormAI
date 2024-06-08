import prisma from "../utils/prisma"
import { Request, Response } from 'express';


export const getPublicUsers = async (req: Request, res: Response) => {
    const { userId} = req.params
    try {
     
      // Get the IDs of users that the current user is following
      const followingIds = await prisma.relationship.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
  
      const followingIdSet = new Set(followingIds.map((rel) => rel.followingId));
  
      // Fetch users that are not followed by the current user
      const usersToDisplay = await prisma.user.findMany({
        where: {
          id: { notIn: [...followingIdSet, userId] },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          followers: { select: { id: true } }, // Fetch followers for sorting
        },
        orderBy: {
          followers: { _count: 'desc' },
        },
        take: 5,
      });
  
      res.status(200).json(usersToDisplay);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
  };

  export const followUser = async (req: DecodedRequest, res: Response) => {
    try {
      const followerId = req.userData!.userId as string;
      const followingId = req.params.id;
  
      const relationshipExists = await prisma.relationship.findUnique({
        where: { followerId_followingId: { followerId: followerId, followingId: followingId } },
      });
  
      if (relationshipExists) {
        return res.status(400).json({ message: 'Already following this user' });
      }
  
      await prisma.relationship.create({
        data: { followerId: followerId, followingId: followingId },
      });
  
      res.status(200).json({ message: 'User followed successfully' });
    } catch (error:any) {
      res.status(500).json({ message: 'Some error occurred while following the user', error: error.message });
    }
  };

  import dayjs from 'dayjs';
import { DecodedRequest, FileUploadRequest } from "../types/interfaces";
import S3ClientSingleton from "../utils/s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const getPublicUser = async (req: DecodedRequest, res: Response) => {
  try {
    const currentUserId = req.userData!.userId as string;
    const userId = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        followers: { select: { id: true } },
        following: { select: { id: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const totalPosts = await prisma.post.count({ where: { userId: userId } });
    const communities = await prisma.community.findMany({
      where: { CommunityUsers: { some: { userId: userId } } },
      select: { id: true, name: true },
    });

    const currentUserCommunities = await prisma.community.findMany({
      where: { CommunityUsers: { some: { userId: currentUserId } } },
      select: { id: true, name: true },
    });

    const commonCommunities = currentUserCommunities.filter((comm) =>
      communities.some((userComm) => userComm.id === comm.id)
    );

    const isFollowing = await prisma.relationship.findUnique({
      where: { followerId_followingId: { followerId: currentUserId, followingId: userId } },
    });

    const followingSince = isFollowing
      ? dayjs(isFollowing.createdAt).format('MMM D, YYYY')
      : null;

    const last30Days = dayjs().subtract(30, 'day').toDate();
    const postsLast30Days = await prisma.post.count({
      where: { userId: userId, createdAt: { gte: last30Days } },
    });

    const responseData = {
      ...user,
      totalPosts,
      communities,
      totalCommunities: communities.length,
      joinedOn: dayjs(user.createdAt).format('MMM D, YYYY'),
      totalFollowers: user.followers.length,
      totalFollowing: user.following.length,
      isFollowing: !!isFollowing,
      followingSince,
      postsLast30Days,
      commonCommunities,
    };

    res.status(200).json(responseData);
  } catch (error:any) {
    res.status(500).json({ message: 'Some error occurred while retrieving the user', error: error.message });
  }
};

export const unfollowUser = async (req: DecodedRequest, res: Response) => {
  try {
    const followerId = req.userData!.userId as string;
    const followingId = req.params.id;

    const relationshipExists = await prisma.relationship.findUnique({
      where: { followerId_followingId: { followerId: followerId, followingId: followingId } },
    });

    if (!relationshipExists) {
      return res.status(400).json({ message: 'Relationship does not exist' });
    }

    await prisma.relationship.delete({
      where: { followerId_followingId: { followerId: followerId, followingId: followingId } },
    });

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error:any) {
    res.status(500).json({ message: 'Some error occurred while unfollowing the user', error: error.message });
  }
};

export const getFollowingUsers = async (req: DecodedRequest, res: Response) => {
  try {
    const relationships = await prisma.relationship.findMany({
      where: { followerId: req.userData!.userId as string },
      include: { followingUser: true },
    });

    const followingUsers = relationships
      .map((relationship) => ({
        ...relationship.followingUser,
        followingSince: relationship.createdAt,
      }))
      .sort((a, b) => b.followingSince.getTime() - a.followingSince.getTime());

    res.status(200).json(followingUsers);
  } catch (error:any) {
    res.status(500).json({ message: 'Some error occurred while retrieving the following users', error: error.message });
  }
};


export const uploadProfilePic = async (req: FileUploadRequest, res: Response) => {
  try {
    const userId = req.userData!.userId;
    const { location: fileUrl, type: fileType, filename } = req.fileInfo!;

    if (!filename || !fileType) {
      return res.status(400).json({ message: 'File URL and File Type are required' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: fileUrl,
      },
      select: {
        avatarUrl: true,
      }
    });

    res.status(200).json({ message: 'Profile picture uploaded successfully', user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ message: 'Error uploading profile picture', error: error.message });
  }

  
};

export const resetProfilePic = async (req: DecodedRequest, res: Response) => {
  const s3 = S3ClientSingleton.getInstance();
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
  try {
    const userId = req.userData!.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.avatarUrl) {
      return res.status(404).json({
        message: 'Profile picture not found or already reset',
      });
    }

    const deleteParams = {
      Bucket: BUCKET_NAME!,
      Key: user.avatarUrl,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));

    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
    });

    res.status(200).json({ message: 'Profile picture reset successfully' });
  } catch (error) {
    res.status(404).json({
      message: 'An error occurred while resetting the profile picture',
    });
  }
};