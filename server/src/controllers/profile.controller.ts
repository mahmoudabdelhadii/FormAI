import prisma from "../utils/prisma"
import { Request, Response } from 'express';
export const getPublicUsers = async (req: Request, res: Response) => {
    const { userId} = req.body
    try {
     
      // Get the IDs of users that the current user is following
      const followingIds = await prisma.relationship.findMany({
        where: { follower: userId },
        select: { following: true },
      });
  
      const followingIdSet = new Set(followingIds.map((rel) => rel.following));
  
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