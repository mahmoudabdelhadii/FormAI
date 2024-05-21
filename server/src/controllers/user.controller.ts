
import type { Request, Response } from 'express';
import prisma from "../utils/prisma"


const getUser = async (req:Request, res:Response) => {
    const { username } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
              CommunityUser: true,
              Token: true,
            },
          });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user" });
    }
  };

  export {getUser};