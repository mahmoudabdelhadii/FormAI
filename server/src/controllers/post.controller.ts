import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { Prisma } from '../generated/client';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
dayjs.extend(relativeTime);
import formatCreatedAt from '../utils/timeConverter';
// Helper function to format post data

const formatPost = (post: any) => ({
  ...post,
  createdAt: dayjs(post.createdAt).fromNow(),
});

// Helper function to format comments data
const formatComments = (comments: any[]) =>
  comments.map((comment) => ({
    ...comment,
    createdAt: dayjs(comment.createdAt).fromNow(),
  }));

// Get single post by ID
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

  

    // const savedByCount = await prisma.user.count({
    //   where: { savedPosts: { has: postId } },
    // });

    const report = await prisma.report.findFirst({
      where: { postId:postId, reportedBy: userId },
    });

    // formattedPost.savedByCount = savedByCount;


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

// Get all posts for the communities the user is a member of
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
      },
    });

    res.status(200).json({ formattedPosts, totalPosts });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving posts',
    });
  }
};

// Get all posts for a specific community
export const getCommunityPosts = async (req: Request, res: Response) => {
  try {
    const communityId = req.params.communityId;
    const userId = req.params.userId;
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
      where: { communityId: communityId },
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
      where: { communityId: communityId },
    });

    res.status(200).json({ formattedPosts, totalCommunityPosts });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving posts',
    });
  }
};

// Get posts of the users that the current user is following in a given community
export const getFollowingUsersPosts = async (req: Request, res: Response) => {
  try {
    const communityId = req.params.id;
    const userId = req.params.userId;

    const following = await prisma.relationship.findMany({
      where: { followerId: userId },
    });

    const followingIds = following.map((relationship) => relationship.followingId);

    const posts = await prisma.post.findMany({
      where: {
        userId: { in: followingIds },
        communityId: communityId,
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

// Delete a post by ID
export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({
        message: 'Post not found. It may have been deleted already',
      });
    }

    await prisma.post.delete({ where: { id: postId } });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(404).json({
      message: 'An error occurred while deleting the post',
    });
  }
};

// Like a post
export const likePost = async (req: Request, res: Response) => {
    try {
      const postId = req.params.id;
      const userId = req.params.userId;
  
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          Likes: {
            create: { userId: userId  },
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

// Unlike a post
export const unlikePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.params.userId;

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

// Add a comment to a post
export const addComment = async (req: Request, res: Response) => {
  try {
    const { content, postId } = req.body;
    const userId = req.params.userId;

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

// Save a post
// export const savePost = async (req: Request, res: Response) => {
//   await saveOrUnsavePost(req, res, 'connect');
// };

// // Unsave a post
// export const unsavePost = async (req: Request, res: Response) => {
//   await saveOrUnsavePost(req, res, 'disconnect');
// };

// const saveOrUnsavePost = async (
//   req: Request,
//   res: Response,
//   operation: 'connect' | 'disconnect'
// ) => {
//   try {
//     const postId = req.params.id;
//     const userId = req.userId;

//     const updatedUserPost = await prisma.user.update({
//       where: { id: userId },
//       data: {
//         savedPosts: {
//           [operation]: { id: postId },
//         },
//       },
//       select: {
//         savedPosts: {
//           include: {
//             Community: { select: { name: true } },
//           },
//         },
//       },
//     });

//     const formattedPosts = updatedUserPost.savedPosts.map(formatPost);

//     res.status(200).json(formattedPosts);
//   } catch (error) {
//     res.status(500).json({
//       message: 'Server error',
//     });
//   }
// };

// Get saved posts for the user
// export const getSavedPosts = async (req: Request, res: Response) => {
//   try {
//     const userId = req.userId;

//     const user = await prisma.user.findUnique({ where: { id: userId } });

//     if (!user) {
//       return res.status(404).json({
//         message: 'User not found',
//       });
//     }

//     const communityIds = await prisma.communityUser.findMany({
//       where: { user: userId },
//       select: { community: true },
//     });

//     const savedPosts = await prisma.post.findMany({
//       where: {
//         community: { in: communityIds.map((c) => c.community) },
//         id: { in: user.savedPosts },
//       },
//       include: {
//         User: { select: { firstName: true, lastName: true, avatarUrl: true } },
//         Community: { select: { name: true } },
//       },
//     });

//     const formattedPosts = savedPosts.map(formatPost);

//     res.status(200).json(formattedPosts);
//   } catch (error) {
//     res.status(500).json({
//       message: 'Server error',
//     });
//   }
// };

// Get public posts of a user
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
//   const savedByCount = await prisma.user.count({
//     where: { savedPosts: { has: post.id } },
//   });

  return {
    ...post,
    createdAt: dayjs(post.createdAt).fromNow(),
  };
};
