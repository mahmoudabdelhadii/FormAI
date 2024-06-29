import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { Prisma } from '../generated/client';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
dayjs.extend(relativeTime);
import formatCreatedAt from '../utils/timeConverter';
import { DecodedRequest, DecodedToken,FileDeleteRequest,FileUploadRequest } from '../types/interfaces';
import S3ClientSingleton from '../utils/s3Client';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = S3ClientSingleton.getInstance();
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const formatPost = (post: any) => ({
  ...post,
  createdAt: dayjs(post.createdAt).fromNow(),
});

const formatComments = (comments: any[]) =>
  comments.map((comment) => ({
    ...comment,
    createdAt: dayjs(comment.createdAt).fromNow(),
  }));


  export const getFeed = async (req: DecodedRequest, res: Response) => {
    try {
      const userId = req.userData!.userId;
      const { limit = 10, skip = 0 } = req.query;
  
      // Fetch communities the user is part of
      const communities = await prisma.community.findMany({
        where: {
          CommunityUsers: {
            some: { userId: userId },
          },
        },
      });
  
      const communityIds = communities.map((community) => community.id);
  
      // Fetch users the user is following
      const followingUsers = await prisma.relationship.findMany({
        where: { followerId: userId },
        include: { followingUser: true },
      });
  
      const followingUserIds = followingUsers.map((relationship) => relationship.followingId);
  
      // Fetch users who follow the user back
      const followers = await prisma.relationship.findMany({
        where: {
          followingId: userId,
          followerId: { in: followingUserIds },
        },
      });
  
      const followerUserIds = followers.map((relationship) => relationship.followerId);
  
      // Fetch posts from communities, mutual follows, and public posts
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { communityId: { in: communityIds } },
            { userId: { in: followerUserIds } },
            { visibility: 'PUBLIC' },
          ],
          createdAt: {
            gte: dayjs().subtract(7, 'day').toDate(),
          },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          User: { select: { firstName: true, lastName: true, avatarUrl: true } },
          Community: { select: { name: true } },
          Likes: true,
          Comments: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: { User: { select: { firstName: true, lastName: true, avatarUrl: true } } },
          },
        },
        skip: parseInt(skip as string),
        take: parseInt(limit as string),
      });
  
      const formattedPosts = posts.map((post) => ({
        ...formatPost(post),
        likesCount: post.Likes.length,
        comments: post.Comments.map((comment) => ({
          ...comment,
          createdAt: dayjs(comment.createdAt).fromNow(),
        })),
      }));
  
      const totalPosts = await prisma.post.count({
        where: {
          OR: [
            { communityId: { in: communityIds } },
            { userId: { in: followerUserIds } },
            { visibility: 'PUBLIC' },
          ],
          createdAt: {
            gte: dayjs().subtract(7, 'day').toDate(),
          },
        },
      });
  
      res.status(200).json({ formattedPosts, totalPosts });
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving feed',
      });
    }
  };
  
  export const addPost = async (req: FileUploadRequest, res: Response) => {
    try {
      const { content, communityId, caption, visibility } = req.body;
      const userId = req.userData!.userId;
      const {location: fileUrl,type: fileType, filename} = req.fileInfo!
      console.log(req.fileInfo)
      if (!filename || !fileType) {
        return res.status(400).json({ message: 'File URL and File Type are required' });
      }
  
      const newPost = await prisma.post.create({
        data: {
          content,
          fileUrl,
          fileType,
          communityId,
          userId,
          caption,
          visibility,
          createdAt: dayjs().toDate(),
        },
      });
  
      res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error:any) {
      res.status(500).json({ message: 'Error creating post', error: error.message });
    }
  };
export const getPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.params.userId;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        User: { select: { firstName: true, lastName: true, avatarUrl: true } },
        Community: { select: { name: true } },
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      orderBy: { createdAt: 'desc' },
      include: {
        User: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
    });

    const report = await prisma.report.findFirst({
      where: { postId: postId, reportedBy: userId },
    });

    const formattedPost = {
      ...post,
      comments: formatComments(comments),
      dateTime: post.createdAt?.toDateString(),
      createdAt: dayjs(post.createdAt).fromNow(),
      isReported: !!report,
    };
    res.status(200).json(formattedPost);
  } catch (error) {
    res.status(500).json({
      message: 'Error getting post',
    });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { limit = 10, skip = 0 } = req.query;

    const communities = await prisma.community.findMany({
      where: {
        CommunityUsers: {
          some: { userId: userId },
        },
      },
    });

    const communityIds = communities.map((community) => community.id);

    const posts = await prisma.post.findMany({
      where: {
        communityId: { in: communityIds },
        createdAt: {
          gte: dayjs().subtract(7, 'day').toDate(),
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        User: { select: { firstName: true, lastName: true, avatarUrl: true } },
        Community: { select: { name: true } },
      },
      skip: parseInt(skip as string),
      take: parseInt(limit as string),
    });

    const formattedPosts = posts.map(formatPost);

    const totalPosts = await prisma.post.count({
      where: {
        communityId: { in: communityIds },
        createdAt: {
          gte: dayjs().subtract(7, 'day').toDate(),
        },
      },
    });

    res.status(200).json({ formattedPosts, totalPosts });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving posts',
    });
  }
};



export const getCommunityPosts = async (req: DecodedRequest, res: Response) => {
  try {
    const communityId = req.params.communityId;
    const userId = req.userData!.userId;
    const { limit = 10, skip = 0 } = req.query;

    const isMember = await prisma.community.findFirst({
      where: {
        id: communityId,
        CommunityUsers: {
          some: { userId: userId },
        },
      },
    });

    if (!isMember) {
      return res.status(401).json({
        message: 'Unauthorized to view posts in this community',
      });
    }

    const posts = await prisma.post.findMany({
      where: { communityId: communityId, createdAt: { gte: dayjs().subtract(7, 'day').toDate() } },
      orderBy: { createdAt: 'desc' },
      include: {
        User: { select: { firstName: true, lastName: true, avatarUrl: true } },
        Community: { select: { name: true } },
      },
      skip: parseInt(skip as string),
      take: parseInt(limit as string),
    });

    const formattedPosts = posts.map(formatPost);

    const totalCommunityPosts = await prisma.post.count({
      where: { communityId: communityId, createdAt: { gte: dayjs().subtract(7, 'day').toDate() } },
    });

    res.status(200).json({ formattedPosts, totalCommunityPosts });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving posts',
    });
  }
};

export const getFollowingUsersPosts = async (req: DecodedRequest, res: Response) => {
  try {
    const communityId = req.params.id;
    const userId = req.userData!.userId;

    const following = await prisma.relationship.findMany({
      where: { followerId: userId },
    });

    const followingIds = following.map((relationship) => relationship.followingId);

    const posts = await prisma.post.findMany({
      where: {
        userId: { in: followingIds },
        communityId: communityId,
        createdAt: { gte: dayjs().subtract(1, 'day').toDate() },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        User: { select: { firstName: true, lastName: true, avatarUrl: true } },
        Community: { select: { name: true } },
      },
      take: 20,
    });

    const formattedPosts = posts.map(formatPost);

    res.status(200).json(formattedPosts);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const deletePost = async (req: DecodedRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.userData!.userId;


    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (post && post.userId !== userId) {
       
      return res.status(401).json({
        message: 'This user does not have permission to delete this post',
      });
    }
    if (!post) {
      return res.status(404).json({
        message: 'Post not found. It may have been deleted already',
      });
    }

    const deleteParams = {
      Bucket: BUCKET_NAME!,
      Key: post.fileUrl,
    };
    await s3.send(new DeleteObjectCommand(deleteParams));

    await prisma.post.delete({ where: { id: postId } });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(404).json({
      message: 'An error occurred while deleting the post',
    });
  }
};

export const likePost = async (req: DecodedRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.userData!.userId;

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        Likes: {
          create: { userId: userId },
        },
      },
      include: {
        User: { select: { firstName: true, lastName: true, avatarUrl: true } },
        Community: { select: { name: true } },
      },
    });

    const formattedPost = await populatePost(updatedPost);

    res.status(200).json(formattedPost);
  } catch (error) {
    res.status(500).json({
      message: 'Error liking post',
    });
  }
};

export const unlikePost = async (req: DecodedRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.userData!.userId;

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        Likes: {
          delete: { userId_postId: { postId: postId, userId: userId } },
        },
      },
      include: {
        User: { select: { firstName: true, lastName: true, avatarUrl: true } },
        Community: { select: { name: true } },
      },
    });

    const formattedPost = await populatePost(updatedPost);

    res.status(200).json(formattedPost);
  } catch (error) {
    res.status(500).json({
      message: 'Error unliking post',
    });
  }
};

export const addComment = async (req: DecodedRequest, res: Response) => {
  try {
    const { content, postId } = req.body;
    const userId = req.userData!.userId;

    const newComment = await prisma.comment.create({
      data: {
        userId: userId,
        postId: postId,
        body: content,
      },
    });

    res.status(200).json({ message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding comment',
    });
  }
};

export const getPublicPosts = async (req: Request, res: Response) => {
  try {
    const publicUserId = req.params.publicUserId;
    const currentUserId = req.params.userId;

    const isFollowing = await prisma.relationship.findFirst({
      where: {
        followerId: currentUserId,
        followingId: publicUserId,
      },
    });

    if (!isFollowing) {
      return res.status(401).json({
        message: 'Unauthorized to view posts of this user',
      });
    }

    const commonCommunityIds = await prisma.communityUser.findMany({
      where: {
        OR: [
          { userId: currentUserId },
          { userId: publicUserId },
        ],
      },
      select: { communityId: true },
    });

    const publicPosts = await prisma.post.findMany({
      where: {
        communityId: { in: commonCommunityIds.map((c) => c.communityId) },
        userId: publicUserId,
        createdAt: { gte: dayjs().subtract(1, 'day').toDate() },
      },
      include: {
        User: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        Community: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const formattedPosts = publicPosts.map(formatPost);

    res.status(200).json(formattedPosts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const populatePost = async (post: any) => {
  return {
    ...post,
    createdAt: dayjs(post.createdAt).fromNow(),
  };
};
