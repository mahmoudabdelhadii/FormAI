import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const search = async (req: Request, res: Response) => {
  const { q } = req.query; // Changed to query to match usage in the function
  const { userId } = req.params;

  try {
    const searchQuery = q as string;

    // Get the communities the user is a member of
    const userCommunities = await prisma.community.findMany({
      where: {
        CommunityUsers: {
          some: {
            userId: userId, // Changed from user to userId to match schema
          },
        },
      },
      select: {
        id: true,
      },
    });

    const communityIds = userCommunities.map((community) => community.id);

    const [users, posts, joinedCommunity, community] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: searchQuery, mode: 'insensitive' } },
            { lastName: { contains: searchQuery, mode: 'insensitive' } },
            { username: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
        orderBy: {
          firstName: 'asc',
        },
      }),
      prisma.post.findMany({
        where: {
          communityId: { in: communityIds },
          content: { contains: searchQuery, mode: 'insensitive' },
        },
        select: {
          id: true,
          content: true,
          User: {
            select: {
              firstName: true,
              lastName: true,
              username: true,
              avatarUrl: true,
            },
          },
          Community: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.community.findFirst({
        where: {
          AND: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            {
              CommunityUsers: {
                some: {
                  userId: userId, // Changed from user to userId to match schema
                },
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          CommunityUsers: {
            select: {
              User: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
      }),
      prisma.community.findFirst({
        where: {
          AND: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            {
              CommunityUsers: {
                none: {
                  userId: userId, // Changed from user to userId to match schema
                },
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          CommunityUsers: {
            select: {
              User: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Shorten post content for the response
    posts.forEach((post) => {
      if (post.content && post.content.length > 30) {
        post.content = post.content.substring(0, 30) + '...';
      }
    });

    res.status(200).json({ posts, users, community, joinedCommunity });
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};
