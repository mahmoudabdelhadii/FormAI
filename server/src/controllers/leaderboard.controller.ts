import { Request, Response } from 'express';
import prisma from '../utils/prisma';


// Create a new leaderboard for a community
export const createLeaderboard = async (req: Request, res: Response) => {
  const { communityId, liftId } = req.body;

  try {
    const newLeaderboard = await prisma.leaderboard.create({
      data: {
        communityId,
        liftId,
      },
    });
    res.status(201).json(newLeaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating leaderboard' });
  }
};

// Add a submission to a leaderboard
export const addSubmission = async (req: Request, res: Response) => {
  const { userId, communityId, entryUrl, weight, liftId, leaderboardId, verifiedBy } = req.body;

  try {
    const newSubmission = await prisma.leaderboardSubmission.create({
      data: {
        userId,
        communityId,
        entryUrl,
        weight,
        liftId,
        leaderboardId,
        verifiedBy,
      },
    });
    res.status(201).json(newSubmission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding submission' });
  }
};

// Get all submissions for a specific leaderboard
export const getLeaderboardSubmissions = async (req: Request, res: Response) => {
  const { leaderboardId } = req.params;

  try {
    const submissions = await prisma.leaderboardSubmission.findMany({
      where: { leaderboardId },
      include: {
        User: { select: { firstName: true, lastName: true, avatarUrl: true } },
        Verifier: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
      orderBy: { weight: 'desc' },
    });
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving submissions' });
  }
};

// Get all leaderboards for a specific community
export const getCommunityLeaderboards = async (req: Request, res: Response) => {
  const { communityId } = req.params;

  try {
    const leaderboards = await prisma.leaderboard.findMany({
      where: { communityId },
      include: {
        Lift: { select: { name: true } },
        LeaderboardSubmission: {
          include: {
            User: { select: { firstName: true, lastName: true, avatarUrl: true } },
            Verifier: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
          orderBy: { weight: 'desc' },
        },
      },
    });
    res.status(200).json(leaderboards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving leaderboards' });
  }
};

// Update a submission's verification status
export const verifySubmission = async (req: Request, res: Response) => {
  const { submissionId } = req.params;
  const { verifiedBy } = req.body;

  try {
    const updatedSubmission = await prisma.leaderboardSubmission.update({
      where: { id: submissionId },
      data: { verifiedBy, verifiedAt: new Date() },
    });
    res.status(200).json(updatedSubmission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying submission' });
  }
};

// Delete a leaderboard
export const deleteLeaderboard = async (req: Request, res: Response) => {
  const { leaderboardId } = req.params;

  try {
    await prisma.leaderboard.delete({
      where: { id: leaderboardId },
    });
    res.status(200).json({ message: 'Leaderboard deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting leaderboard' });
  }
};

export default {
  createLeaderboard,
  addSubmission,
  getLeaderboardSubmissions,
  getCommunityLeaderboards,
  verifySubmission,
  deleteLeaderboard,
};
