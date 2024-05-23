// /src/middleware/logger.ts
import prisma from '../../utils/prisma';
import getCurrentContextData from '../../utils/contextData';
import { Request } from 'express';

interface LogInfo {
  message: string;
  type: string;
  level: string;
}

/**
 * Saves log info to the database
 * @param req - Express request object
 * @param message {string} - log message
 * @param type {string} - log type (sign in, sign out, api requests)
 * @param level {string} - log level (error, warning, info)
 */
export const saveLogInfo = async (req: Request | null, message: string, type: number, level: number): Promise<void> => {
  try {
    let context = null;
    if (req) {
      const { ip, country, city, os, device, deviceType, platform } = getCurrentContextData(req);

      context = `IP: ${ip}, Country: ${country}, City: ${city}, Device Type: ${deviceType}, Platform: ${platform}, OS: ${os}, Device: ${device}`;
    }

    // Fetch the type and level IDs from the database
    const logType = await prisma.logType.findUnique({ where: { id:type } });
    const logLevel = await prisma.logLevel.findUnique({ where: { id:level } });

    await prisma.log.create({
      data: {
        user: req ? req.body.email : null,
        context,
        message,
        type: logType?.id,
        level: logLevel?.id,
      },
    });
  } catch (error) {
    console.error('Error saving log info:', error);
  }
};
