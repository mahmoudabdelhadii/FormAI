// /src/controllers/authController.ts
import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import getCurrentContextData from '../utils/contextData';
import formatCreatedAt from '../utils/timeConverter';

export const types = {
  NO_CONTEXT_DATA: 'no_context_data',
  MATCH: 'match',
  BLOCKED: 'blocked',
  SUSPICIOUS: 'suspicious',
  ERROR: 'error',
} as const;

export type Types = typeof types[keyof typeof types];

export const isTrustedDevice = (currentContextData: any, userContextData: any): boolean =>
  Object.keys(userContextData).every(
    key => userContextData[key] === currentContextData[key]
  );

export const verifyContextData = async (req: Request, existingUser: { id: string }): Promise<Types> => {
  try {
    const userId = existingUser.id;
    const userContextData = await prisma.context.findUnique({ where: { userId } });

    if (!userContextData) {
      return types.NO_CONTEXT_DATA;
    }

    const currentContextData = getCurrentContextData(req);

    if (isTrustedDevice(currentContextData, userContextData)) {
      return types.MATCH;
    }

    const oldSuspiciousContextData = await prisma.suspiciousLogin.findFirst({
      where: { userId, ...currentContextData }
    });

    if (oldSuspiciousContextData) {
      if (oldSuspiciousContextData.isBlocked) return types.BLOCKED;
      if (oldSuspiciousContextData.isTrusted) return types.MATCH;
    }

    if (oldSuspiciousContextData) {
      if (oldSuspiciousContextData.unverifiedAttempts && oldSuspiciousContextData.unverifiedAttempts >= 3) {
        await prisma.suspiciousLogin.update({
          where: { id: oldSuspiciousContextData.id },
          data: { isBlocked: true, isTrusted: false }
        });

        return types.BLOCKED;
      }

      await prisma.suspiciousLogin.update({
        where: { id: oldSuspiciousContextData.id },
        data: { unverifiedAttempts: { increment: 1 } }
      });

      return types.SUSPICIOUS;
    }

    await prisma.suspiciousLogin.create({
      data: {
        userId,
        ip: currentContextData.ip,
        country: currentContextData.country,
        city: currentContextData.city,
        platform: currentContextData.platform,
        os: currentContextData.os,
        device: currentContextData.device,
        deviceType: currentContextData.deviceType,
        unverifiedAttempts: 1,
        isBlocked: false,
        isTrusted: false
      }
    });

    return types.SUSPICIOUS;
  } catch (error) {
    return types.ERROR;
  }
};


/**
 * @route GET /auth/user-preferences
 */
export const getUserPreferences = async (req: Request, res: Response): Promise<any> => {
  try {
    const {userId} = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const userPreferences = await prisma.preferences.findUnique({
      where: { user:userId },
    });

    if (!userPreferences) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(userPreferences);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


export const addContextData = async (req: Request, res: Response): Promise<void> => {
  const {userId} = req.params;
//   const email = req.email;
  const currentContextData = getCurrentContextData(req);

  try {
    await prisma.context.upsert({
      where: { userId },
      update: {
        ...currentContextData
      },
      create: {
        userId,
        ...currentContextData
      }
    });
    res.status(200).json({ message: 'Context data added/updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAuthContextData = async (req: Request, res: Response): Promise<any> => {
  const {userId} = req.params;
  try {
    const result = await prisma.context.findUnique({ where: { userId: userId } });

    if (!result) {
      return res.status(404).json({ message: 'Not found' });
    }

    const userContextData = {
      ip: result.ip,
      country: result.country,
      city: result.city,
      browser: result.browser,
      platform: result.platform,
      os: result.os,
      device: result.device,
      deviceType: result.deviceType,
      
    };

    res.status(200).json(userContextData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTrustedAuthContextData = async (req: Request, res: Response): Promise<void> => {
  try {
    const {userId} = req.params
    const result = await prisma.suspiciousLogin.findMany({
      where: { userId: userId, isTrusted: true, isBlocked: false }
    });

    const trustedAuthContextData = result.map(item => ({
      id: item.id,
      ip: item.ip,
      country: item.country,
      city: item.city,
      browser: item.browser,
      platform: item.platform,
      os: item.os,
      device: item.device,
      deviceType: item.deviceType
    }));

    res.status(200).json(trustedAuthContextData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBlockedAuthContextData = async (req: Request, res: Response): Promise<void> => {
  const {userId} = req.params
  try {
    const result = await prisma.suspiciousLogin.findMany({
      where: { userId: userId, isBlocked: true, isTrusted: false }
    });

    const blockedAuthContextData = result.map(item => ({
      id: item.id,
      ip: item.ip,
      country: item.country,
      city: item.city,
      browser: item.browser,
      platform: item.platform,
      os: item.os,
      device: item.device,
      deviceType: item.deviceType
    }));

    res.status(200).json(blockedAuthContextData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteContextAuthData = async (req: Request, res: Response): Promise<void> => {
  try {
    const {contextId} = req.params;

    await prisma.suspiciousLogin.delete({ where: { id: contextId } });

    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const blockContextAuthData = async (req: Request, res: Response): Promise<void> => {
  try {
    const contextId = req.params.contextId;

    await prisma.suspiciousLogin.update({
      where: { id: contextId },
      data: { isBlocked: true, isTrusted: false }
    });

    res.status(200).json({ message: 'Blocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const unblockContextAuthData = async (req: Request, res: Response): Promise<void> => {
  try {
    const contextId = req.params.contextId;

    await prisma.suspiciousLogin.update({
      where: { id: contextId },
      data: { isBlocked: false, isTrusted: true }
    });

    res.status(200).json({ message: 'Unblocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
