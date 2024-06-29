import { NextFunction, Response } from 'express';
import prisma from '../utils/prisma';
import getCurrentContextData from '../utils/contextData';
import { DecodedRequest } from '../types/interfaces';

export const types = {
  NO_CONTEXT_DATA: 'no_context_data',
  MATCH: 'match',
  BLOCKED: 'blocked',
  SUSPICIOUS: 'suspicious',
  ERROR: 'error',
} as const;

export type Types = typeof types[keyof typeof types];

/**
 * Checks if the given context data is trusted or not
 * @param currentContextData - Context data of the current request
 * @param userContextData - Context data of the user
 * @returns - Whether the current context data is trusted or not
 */
export const isTrustedDevice = (currentContextData: any, userContextData: any): boolean =>
  /**
   * Iterate through each key in the user context data and check if the value
   * matches with the current context data's value. If all values match then
   * the device is trusted.
   */
  Object.keys(userContextData).every(
    (key) => /**
     * Compare the user context data's value with the current context data's
     * value. If they are equal then the key is trusted.
     */
    userContextData[key] === currentContextData[key]
  );

/**
 * Verifies the context data of the current request against the context data of the user
 * @param {DecodedRequest} req - Request object with user data
 * @param {object} existingUser - User data containing the user's id
 * @returns {Promise<Types>} - Promise that resolves with a type indicating the result of the verification
 */
export const verifyContextData = async (req: DecodedRequest, existingUser: { id: string }): Promise<Types> => {
  /**
   * Find the context data associated with the given user
   */
  try {
    const userId = existingUser.id;
    const userContextData = await prisma.context.findUnique({ where: { userId } });

    if (!userContextData) {
      /**
       * If no context data is found, return 'no_context_data'
       */
      return types.NO_CONTEXT_DATA;
    }

    const currentContextData = getCurrentContextData(req);

    /**
     * Check if the device is trusted or not
     */
    if (isTrustedDevice(currentContextData, userContextData)) {
      /**
       * If the device is trusted, return 'match'
       */
      return types.MATCH;
    }

    /**
     * Find if there is any suspicious login data for the given user that matches the current context data
     */
    const oldSuspiciousContextData = await prisma.suspiciousLogin.findFirst({
      where: { userId, ...currentContextData }
    });

    if (oldSuspiciousContextData) {
      /**
       * If there is a matching suspicious login data and it is blocked, return 'blocked'
       */
      if (oldSuspiciousContextData.isBlocked) return types.BLOCKED;

      /**
       * If there is a matching suspicious login data and it is trusted, return 'match'
       */
      if (oldSuspiciousContextData.isTrusted) return types.MATCH;

      /**
       * If there is a matching suspicious login data and it is not blocked and not trusted,
       * increment the number of unverified attempts
       */
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

    /**
     * If no matching suspicious login data is found, create a new one
     */
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
    /**
     * If an error occurs, return 'error'
     */
    return types.ERROR;
  }
};

/**
 * Returns the user preferences for the given user
 * @param {DecodedRequest} req - Request object with user data
 * @param {Response} res - Response object to send back
 * @returns {Promise<void>} - Promise that resolves with a JSON response containing the user's preferences
 */
export const getUserPreferences = async (req: DecodedRequest, res: Response): Promise<void> => {
  /**
   * Finds the user preferences for the given user
   * @param {DecodedRequest} req - Request object with user data
   * @returns {Promise<Preferences | null>} - Promise that resolves with the user's preferences if it exists, or null if it doesn't
   */
  try {
    const { userId } = req.userData!;

    const userPreferences = await prisma.preferences.findUnique({
      where: { userId },
    });

    if (!userPreferences) {
      // If the user preferences don't exist, return a 404 error
      res.status(404).json({ message: "Not found" });
      return;
    }

    // Return the user preferences in a JSON response
    res.status(200).json(userPreferences);
  } catch (error) {
    // If an error occurs, return an internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Adds/updates the context data for the given user
 * @param {DecodedRequest} req - Request object with user data
 * @param {Response} res - Response object to send back
 * @returns {Promise<void>} - Promise that resolves with a JSON response containing a success message
 */
export const addContextData = async (req: DecodedRequest, res: Response): Promise<void> => {
  const { userId } = req.userData!;
  const currentContextData = getCurrentContextData(req);

  try {
    await prisma.context.upsert({
      where: { userId },
      update: {
        // Updates the existing context data with the new values
        ...currentContextData
      },
      create: {
        // Creates a new context data entry with the given values
        userId,
        ...currentContextData
      }
    });

    // Send a success response
    res.status(200).json({ message: 'Context data added/updated successfully' });
  } catch (error) {
    // Send an internal server error response
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Returns the current user's context data
 * @param {DecodedRequest} req - Request object with user data
 * @param {Response} res - Response object to send back
 * @returns {Promise<void>} - Promise that resolves with a JSON response containing the user's context data
 */
export const getAuthContextData = async (req: DecodedRequest, res: Response): Promise<void> => {
  /**
   * Finds the context data for the given user
   * @param {DecodedRequest} req - Request object with user data
   * @returns {Promise<ContextData | null>} - Promise that resolves with the user's context data if it exists, or null if it doesn't
   */
  const { userId } = req.userData!;
  try {
    const result = await prisma.context.findUnique({ where: { userId } });

    if (!result) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    /**
     * Maps the context data from the database into a JSON object
     * @type {ContextData}
     */
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


/**
 * Returns all the suspicious login context data that is trusted and not blocked for a given user.
 * @param {DecodedRequest} req - Request object with user data
 * @param {Response} res - Response object to send back
 * @returns {Promise<void>} - Promise that resolves with a JSON response containing the trusted context data
 */
export const getTrustedAuthContextData = async (req: DecodedRequest, res: Response): Promise<void> => {
  /**
   * Finds all the suspicious logins for the given user that are trusted and not blocked
   */
  try {
    const { userId } = req.userData!;
    const result = await prisma.suspiciousLogin.findMany({
      where: { userId, isTrusted: true, isBlocked: false }
    });

    /**
     * Maps the result into an array of objects that contain the trusted context data
     */
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

/**
 * Returns all the suspicious login context data that is blocked for a given user.
 * @param {DecodedRequest} req - Request object with user data
 * @param {Response} res - Response object to send back
 * @returns {Promise<void>} - Promise that resolves with a JSON response containing the blocked context data
 */
export const getBlockedAuthContextData = async (req: DecodedRequest, res: Response): Promise<void> => {
  const { userId } = req.userData!;
  /**
   * Finds all the suspicious logins for the given user that are blocked and not trusted
   */
  try {
    const result = await prisma.suspiciousLogin.findMany({
      where: { userId, isBlocked: true, isTrusted: false }
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

/**
 * Deletes a suspicious login context data
 * @param {DecodedRequest} req - Request object with user data
 * @param {Response} res - Response object to send back
 * @returns {Promise<void>} - Promise that resolves with no value
 */
export const deleteContextAuthData = async (req: DecodedRequest, res: Response): Promise<void> => {
  /**
   * Deletes a suspicious login context data by its id
   * @param {string} contextId - ID of the context data to delete
   */
  try {
    const { contextId } = req.params;

    await prisma.suspiciousLogin.delete({ where: { id: contextId } });

    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Blocks a context auth data
 * @param {DecodedRequest} req - Request object with user data
 * @param {Response} res - Response object to send back
 * @returns {Promise<void>} - Promise that resolves with no value
 */
export const blockContextAuthData = async (req: DecodedRequest, res: Response): Promise<void> => {
  /**
   * Blocks a suspicious login context data
   * @param {string} contextId - ID of the context data to block
   */
  try {
    const { contextId } = req.params;

    // Update the context data with isBlocked set to true and isTrusted set to false
    await prisma.suspiciousLogin.update({
      where: { id: contextId },
      data: { isBlocked: true, isTrusted: false }
    });

    // Send a successful response
    res.status(200).json({ message: 'Blocked successfully' });
  } catch (error) {
    // Send an internal server error response
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Unblocks a context auth data
 * @param {DecodedRequest} req - Request object with user data
 * @param {Response} res - Response object to send back
 * @returns {Promise<void>} - Promise that resolves with no value
 */
export const unblockContextAuthData = async (req: DecodedRequest, res: Response): Promise<void> => {
  /**
   * Unblocks a suspicious login context data
   * @param {string} contextId - ID of the context data to unblock
   */
  try {
    const { contextId } = req.params;

    // Update the context data with isBlocked set to false and isTrusted set to true
    await prisma.suspiciousLogin.update({
      where: { id: contextId },
      data: { isBlocked: false, isTrusted: true }
    });

    // Send a successful response
    res.status(200).json({ message: 'Unblocked successfully' });
  } catch (error) {
    // Send an internal server error response
    res.status(500).json({ message: 'Internal server error' });
  }
};

