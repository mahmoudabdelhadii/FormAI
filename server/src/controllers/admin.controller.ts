
import type { Request, Response } from 'express';
import prisma from "../utils/prisma"

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
        where: {
          id: parseInt(communityId),
        },
        
      })


        
  
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }

  
      const moderatorCount = community.moderators.length;
      const memberCount = community.members.length;
      const formattedCommunity = {
        ...community,
        memberCount,
        moderatorCount,
      };
      res.status(200).json(formattedCommunity);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving community" });
    }
  };
  
  const getModerators = async (req:Request, res:Response) => {
    try {
      const moderators = await prisma.user.findMany({ role: "moderator" }).select(
        "_id name email"
      );
      res.status(200).json(moderators);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving moderators" });
    }
  };
  const addModerator = async (req:Request, res:Response) => {
    try {
      const { communityId, moderatorId } = req.query;
      const community = await prisma.community.findById(communityId);
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      const existingModerator = community.moderators.find(
        (mod) => mod.toString() === moderatorId
      );
      if (existingModerator) {
        return res.status(400).json({ message: "Already a moderator" });
      }
      community.moderators.push(moderatorId);
      community.members.push(moderatorId);
      await community.save();
      res.status(200).json({ message: "Moderator added" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error adding moderator" });
    }
  };
  
  const removeModerator = async (req:Request, res:Response) => {
    try {
      const { communityId, moderatorId } = req.query;
  
      const community = await prisma.community.findById(communityId);
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      const existingModerator = community.moderators.find(
        (mod) => mod.toString() === moderatorId
      );
      if (!existingModerator) {
        return res.status(400).json({ message: "Not a moderator" });
      }
      community.moderators = community.moderators.filter(
        (mod) => mod.toString() !== moderatorId
      );
      community.members = community.members.filter(
        (mod) => mod.toString() !== moderatorId
      );
  
      await community.save();
      res.status(200).json({ message: "Moderator removed" });
    } catch (error) {
      res.status(500).json({ message: "Error removing moderator" });
    }
  };