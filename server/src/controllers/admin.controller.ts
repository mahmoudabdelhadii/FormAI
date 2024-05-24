import prisma from "../utils/prisma";
import { Request, Response } from 'express';
import generateSignedUrl from "../utils/SignedUrl";

export const getModerators = async (req: Request, res: Response) => {
    try {
      const moderators = await prisma.communityUser.findMany({
        where: {
          roleId: 2, // Assuming roleId 2 is for moderators
        },
        // select: {
        //   User: {
        //     select: {
        //       id: true,
        //       firstName: true,
        //       lastName: true,
        //       email: true,
        //     },
        //   },
        // },
      });
  
      res.status(200).json(moderators.map(m => m.userId));
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving moderators' });
    }
  };
  
  export const addModerator = async (req: Request, res: Response) => {
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
  
  export const removeModerator = async (req: Request, res: Response) => {
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

  export const getSignedUrl = async (req: Request, res: Response) => {
  const { objectPath, expireTime } = req.query;
let signedUrl

try{
  if(expireTime){
signedUrl = await generateSignedUrl(objectPath as string, parseInt(expireTime as string))
}
else {
    signedUrl = await generateSignedUrl(objectPath as string)
}

res.status(200).json(signedUrl);
} catch (error) {
  res.status(500).json({ message: "Internal getting signed url" });
}
}