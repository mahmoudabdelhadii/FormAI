import prisma from "../utils/prisma";
import { Request, Response } from 'express';

/**
 * Get all moderators of a community
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @returns {Promise<void>}
 */
export const getCommunityModerators = async (request: Request, response: Response) => {
  try {
    const communityModerators = await prisma.communityUser.findMany({
      where: { roleId: 2 },
    });

    response.status(200).json(communityModerators.map(moderator => moderator.userId));
  } catch (error) {
    response.status(500).json({ message: 'Error retrieving community moderators' });
  }
};

  
  /**
   * Add a moderator to a community
   * @param {Request} req Request object
   * @param {Response} res Response object
   * @returns {Promise<void>}
   */
  export const addModerator = async (req: Request, res: Response) => {
    /**
     * Retrieve the community user to check if the user is already a moderator
     * and update the role if necessary
     */
    try {
      const { communityId, moderatorId } = req.query as { communityId: string; moderatorId: string };

      const communityUser = await prisma.communityUser.findUnique({
        where: {
          userId_communityId: {
            communityId,
            userId: moderatorId,
          },
        },
      });

      if (!communityUser) {
        return res.status(404).json({ message: 'CommunityUser not found' });
      }

      if (communityUser.roleId === 2) {
        return res.status(400).json({ message: 'Already a moderator' });
      }

      /**
       * Update the community user to make the user a moderator
       */
      await prisma.communityUser.update({
        where: {
          userId_communityId: {
            communityId,
            userId: moderatorId,
          },
        },
        data: {
          roleId: 2,
        },
      });

      res.status(200).json({ message: 'Moderator added' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error adding moderator' });
    }
  };
  
  /**
   * Remove a moderator from a community
   * @param {Request} req Request object
   * @param {Response} res Response object
   * @returns {Promise<void>}
   */
  export const removeModerator = async (req: Request, res: Response) => {
    /**
     * Retrieve the community user to check if the user is already a moderator
     * and update the role if necessary
     */
    try {
      const { communityId, moderatorId } = req.query as { communityId: string; moderatorId: string };

      const communityUser = await prisma.communityUser.findUnique({
        where: {
          userId_communityId: {
            communityId,
            userId: moderatorId,
          },
        },
      });

      if (!communityUser) {
        return res.status(404).json({ message: 'CommunityUser not found' });
      }

      if (communityUser.roleId !== 2) {
        return res.status(400).json({ message: 'Not a moderator' });
      }

      /**
       * Update the community user to remove the user as a moderator
       */
      await prisma.communityUser.update({
        where: {
          userId_communityId: {
            communityId,
            userId: moderatorId,
          },
        },
        data: {
          roleId: 3, // Assuming roleId 3 is for member
        },
      });

      res.status(200).json({ message: 'Moderator removed' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing moderator' });
    }
  };

