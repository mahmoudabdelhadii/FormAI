import { Request, Response } from 'express';
import prisma from '../utils/prisma';


export const search = async (req: Request, res: Response) => {
    const {q} = req.params
    const {userId} = req.params
    try {
    const searchQuery = q;

    // Get the communities the user is a member of
    const userCommunities = await prisma.community.findMany({
      where: {
        CommunityUser: {
          some: {
            user: userId
          },
        },
      },
      select: {
        id: true,
        name:true,
        CommunityUser:true,
      },
    });

    const communityIds = userCommunities.map((community) => community.id);

    const [users, posts, joinedCommunity, community] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: searchQuery as string, mode: 'insensitive' } },
            { lastName: { contains: searchQuery as string, mode: 'insensitive' } },
            { email: { contains: searchQuery as string, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          username:true,
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
          community: 
          { in: communityIds },
          content: { contains: searchQuery as string, mode: 'insensitive' },
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
            {
              name: { contains: searchQuery as string, mode: 'insensitive' },
            },
            {
              CommunityUser: {
                some: {
                  user: userId,
                },
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          CommunityUser: {
            select: {
              User: {
                select: {
                  id: true,
                  username:true,
                },
              },
            },
          },
        },
      }),
      prisma.community.findFirst({
        where: {
          AND: [
            {
              name: { contains: searchQuery as string, mode: 'insensitive' },
            },
            {
              CommunityUser: {
                none: {
                  user: userId,
                },
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          CommunityUser: {
            select: {
              User: {
                select: {
                  id: true,
                  username:true,
                },
              },
            },
          },
        },
      }),
    ]);

    posts.forEach((post) => {
      if (post.content && post.content?.length > 30) {
        post.content = post.content.substring(0, 30) + '...';
      }
    });

    res.status(200).json({ posts, users, community, joinedCommunity });
  } catch (error:any) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};
