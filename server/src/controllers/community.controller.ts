
import type { Request, Response } from 'express';
import prisma from "../utils/prisma"
import { equal } from 'assert';
import generateSignedUrl from '../utils/SignedUrl';

const getCommunities = async (req:Request, res:Response) => {
    try {
      const communities = await prisma.community.findMany()
      res.status(200).json(communities);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving communities" });
    }
  };
  
  const getCommunity = async (req:Request, res:Response) => {
    try {
      const { communityId } = req.params;
      const community = await prisma.community.findFirst({
        relationLoadStrategy: 'join', 
        where: {
          id: communityId,
          
        },
        include: {
          CommunityRequest: {
            select:{
              id: true,
            user: true,
            requestedAt: true,
            message: true 
            }
          },
          CommunityUser:{
            select:{
              user:true,
              verifiedAt: true,
              UserRoles:{
                select: {
                    role:true
                }
              },
            }
          },
          BannedUsers:true,
    
        },
        
      })
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }

      
       const moderatorCount = community.CommunityUser
      // const memberCount = community.members.length;
      // const formattedCommunity = {
      //   ...community,
      //   memberCount,
      //   moderatorCount,
      // };
      res.status(200).json(community);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving community" });
    }
  };
  
  const getModerators = async (req:Request, res:Response) => {
    
    try {
      const { communityId } = req.params;
      const moderators = await prisma.communityUser.findMany({
        where: {
          community: communityId, 
          role: 2
        },
        include:{
          UserRoles: {
            select: {
              role: true,
            },
          }
        }

      })
      res.status(200).json(moderators);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving moderators" });
    }
  };
  const addModerator = async (req:Request, res:Response) => {
    try {
      const { communityId, moderatorId } = req.query;

      if (!communityId){
        return res.status(404).json({ message: "no community id provided" });
      }
      const community = await prisma.communityUser.findMany({
        where:{
          community: communityId.toString(),
          role: 2
        },
        select:{
          user:true
        }
      });
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      const existingModerator = community

      console.log(existingModerator)
      if (existingModerator) {
        return res.status(400).json(community);
      }
      // community.moderators.push(moderatorId);
      // community.members.push(moderatorId);
      // await community.save();
      res.status(200).json({ message: "Moderator added!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error adding moderator" });
    }
  };
  

  const getSignedUrl = async (req:Request, res:Response) => {
    try {
      const { url } = req.body;
     
      if (!url) {
        return res.status(400).json({ message: 'Object path (url) is required' });
      }
      const data = generateSignedUrl(url)
     
      res.status(200).json({ message: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error signing url" });
    }
  };

  // const removeModerator = async (req:Request, res:Response) => {
  //   try {
  //     const { communityId, moderatorId } = req.query;
  
  //     const community = await prisma.community.findById(communityId);
  //     if (!community) {
  //       return res.status(404).json({ message: "Community not found" });
  //     }
  //     const existingModerator = community.moderators.find(
  //       (mod) => mod.toString() === moderatorId
  //     );
  //     if (!existingModerator) {
  //       return res.status(400).json({ message: "Not a moderator" });
  //     }
  //     community.moderators = community.moderators.filter(
  //       (mod) => mod.toString() !== moderatorId
  //     );
  //     community.members = community.members.filter(
  //       (mod) => mod.toString() !== moderatorId
  //     );
  
  //     await community.save();
  //     res.status(200).json({ message: "Moderator removed" });
  //   } catch (error) {
  //     res.status(500).json({ message: "Error removing moderator" });
  //   }
  // };

  export {getSignedUrl,getCommunities,getCommunity,getModerators,addModerator}