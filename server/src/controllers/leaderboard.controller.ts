import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { DecodedRequest, FileUploadRequest } from '../types/interfaces';
import S3ClientSingleton from '../utils/s3Client';
import { DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';


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
export const addSubmission = async (req: FileUploadRequest, res: Response) => {
  const {userId} = req.userData!
  const {location: entryUrl} = req.fileInfo!
  const {   weight, liftId } = req.body;
  const {leaderboardId} = req.params

  try {
    const newSubmission = await prisma.leaderboardSubmission.create({
      data: {
        userId,
        communityId:"",
        entryUrl,
        weight,
        liftId,
        leaderboardId,
        verifiedBy: null,
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
export const deleteEntry = async (req: DecodedRequest, res: Response) => {
  const s3 = S3ClientSingleton.getInstance();
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
  try {
    const entryId = req.params.id;
    const userId = req.userData!.userId;

    const entry = await prisma.leaderboardSubmission.findUnique({ where: { id: entryId } });
    if (entry && entry.userId !== userId) {
      return res.status(401).json({
        message: 'This user does not have permission to delete this entry',
      });
    }
    if (!entry) {
      return res.status(404).json({
        message: 'Entry not found. It may have been deleted already',
      });
    }

    const deleteParams = {
      Bucket: BUCKET_NAME!,
      Key: entry.entryUrl!,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));

    await prisma.leaderboardSubmission.delete({ where: { id: entryId } });

    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(404).json({
      message: 'An error occurred while deleting the entry',
    });
  }
};
// Delete a leaderboard
export const deleteLeaderboard = async (req: Request, res: Response) => {
  const s3 = S3ClientSingleton.getInstance();
  const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
  const { leaderboardId } = req.params;

  try {
    // Fetch all entries related to the leaderboard
    const entries = await prisma.leaderboardSubmission.findMany({
      where: { leaderboardId },
    });

    // Prepare a batch delete request for S3
    const deleteObjects = entries.map(entry => ({
      Key: entry.entryUrl!,
    }));

    if (deleteObjects.length > 0) {
      const deleteParams = {
        Bucket: BUCKET_NAME!,
        Delete: {
          Objects: deleteObjects,
          Quiet: true,
        },
      };
      await s3.send(new DeleteObjectsCommand(deleteParams));
    }

    // Delete the entries from the database
    await prisma.leaderboardSubmission.deleteMany({
      where: { leaderboardId },
    });

    // Delete the leaderboard itself from the database
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
