import bcrypt from 'bcrypt';
import jwt, { JwtPayload, decode, sign, verify } from 'jsonwebtoken';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

import { saveLogInfo } from '../middleware/logger';
import formatCreatedAt from '../utils/timeConverter';
import { verifyContextData, types } from './auth.controller';
import {hashPassword} from "../utils/createPassword"
import { verifyPassword } from '../utils/verifyPassword';
import * as crypto from "node:crypto"
import { createTransport } from 'nodemailer';
import { resetPasswordHTML } from '../utils/emailTemplates';
import { passwordSchema } from '../models/user.model';
import { DecodedRequest } from '../types/interfaces';
dayjs.extend(duration);

const LOG_TYPE = {
  SIGN_IN: 1,
  LOGOUT: 2,
};

const LEVEL = {
  INFO: 1,
  ERROR: 2,
  WARN: 3,
};

const MESSAGE = {
  SIGN_IN_ATTEMPT: 'User attempting to sign in',
  SIGN_IN_ERROR: 'Error occurred while signing in user: ',
  INCORRECT_EMAIL: 'Incorrect email',
  INCORRECT_PASSWORD: 'Incorrect password',
  DEVICE_BLOCKED: 'Sign in attempt from blocked device',
  CONTEXT_DATA_VERIFY_ERROR: 'Context data verification failed',
  MULTIPLE_ATTEMPT_WITHOUT_VERIFY: 'Multiple sign in attempts detected without verifying identity.',
  LOGOUT_SUCCESS: 'User has logged out successfully',
  PASSWORD_RESET_REQUEST: 'Password reset request received',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent',
  PASSWORD_RESET_ERROR: 'Error occurred while processing password reset request',
  INVALID_TOKEN: 'Invalid or expired password reset token',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
};

interface CustomRequest extends Request {
  body: {
    identifier: string;
    password: string;
    mismatchedProps?: string[];
    currentContextData?: object;
    user?: any; // Adjust the type according to your user model
  };
}
export const signin = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
  await saveLogInfo(req, MESSAGE.SIGN_IN_ATTEMPT, LOG_TYPE.SIGN_IN, LEVEL.INFO);
  const { identifier, password } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });

    if (!existingUser) {
      await saveLogInfo(req, MESSAGE.INCORRECT_EMAIL, LOG_TYPE.SIGN_IN, LEVEL.ERROR);
      return res.status(404).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await verifyPassword(existingUser.password, password);
    if (!isPasswordCorrect) {
      await saveLogInfo(req, MESSAGE.INCORRECT_PASSWORD, LOG_TYPE.SIGN_IN, LEVEL.ERROR);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userPreference = await prisma.preferences.findUnique({
      where: { userId: existingUser.id },
    });

    if (userPreference?.enableContextBasedAuth) {
      const contextDataResult = await verifyContextData(req, existingUser);

      if (contextDataResult === types.BLOCKED) {
        await saveLogInfo(req, MESSAGE.DEVICE_BLOCKED, LOG_TYPE.SIGN_IN, LEVEL.WARN);
        return res.status(401).json({
          message: "You've been blocked due to suspicious login activity. Please contact support for assistance.",
        });
      }

      if (contextDataResult === types.NO_CONTEXT_DATA || contextDataResult === types.ERROR) {
        await saveLogInfo(req, MESSAGE.CONTEXT_DATA_VERIFY_ERROR, LOG_TYPE.SIGN_IN, LEVEL.ERROR);
        return res.status(500).json({ message: 'Error occurred while verifying context data' });
      }

      if (contextDataResult === types.SUSPICIOUS) {
        await saveLogInfo(req, MESSAGE.MULTIPLE_ATTEMPT_WITHOUT_VERIFY, LOG_TYPE.SIGN_IN, LEVEL.WARN);
        return res.status(401).json({
          message: `You've temporarily been blocked due to suspicious login activity. We have already sent a verification email to your registered email address. 
          Please follow the instructions in the email to verify your identity and gain access to your account.

          Please note that repeated attempts to log in without verifying your identity will result in this device being permanently blocked from accessing your account.
          
          Thank you for your cooperation`,
        });
      }

      if (
        typeof contextDataResult === 'object' &&
        contextDataResult !== null &&
        'mismatchedProps' in contextDataResult &&
        'currentContextData' in contextDataResult
      ) {
        const { mismatchedProps, currentContextData } = contextDataResult as {
          mismatchedProps: unknown;
          currentContextData: unknown;
        };

        if (
          Array.isArray(mismatchedProps) &&
          mismatchedProps.every((prop) => typeof prop === 'string') &&
          typeof currentContextData === 'object' &&
          currentContextData !== null
        ) {
          if (
            mismatchedProps.some((prop) =>
              ['ip', 'country', 'city', 'device', 'deviceType', 'os', 'platform'].includes(prop)
            )
          ) {
            req.body.mismatchedProps = mismatchedProps as string[];
            req.body.currentContextData = currentContextData as object;
            req.body.user = existingUser;
            return next();
          }
        }
      }
    }

    const payload = { id: existingUser.id, email: existingUser.email };
    const accessToken = sign(payload, process.env.SECRET as string, { expiresIn: '100d' });
    const refreshToken = sign(payload, process.env.REFRESH_SECRET as string, { expiresIn: '14d' });

    const existingToken = await prisma.token.findUnique({
      where: { userId: existingUser.id },
    });

    if (existingToken) {
      await prisma.token.update({
        where: { id: existingToken.id },
        data: {
          accessToken,
          refreshToken,
        },
      });
    } else {
      await prisma.token.create({
        data: {
          userId: existingUser.id,
          refreshToken,
          accessToken,
        },
      });
    }
  
    res.status(200).json({
      accessToken,
      refreshToken,
      accessTokenUpdatedAt: new Date().toISOString(),
      user: {
        id: existingUser.id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        avatarUrl: existingUser.avatarUrl,
        username: existingUser.username,
        bio: existingUser.bio,
        weight: existingUser.weight,
        height: existingUser.height,
        

      },
    });
  } catch (err: any) {
    await saveLogInfo(req, MESSAGE.SIGN_IN_ERROR + err.message, LOG_TYPE.SIGN_IN, LEVEL.ERROR);
    
    res.status(500).json({ message: 'Something went wrong' + err });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1] ?? null;
    if (accessToken) {
      await prisma.token.deleteMany({ where: { accessToken } });
      await saveLogInfo(null, MESSAGE.LOGOUT_SUCCESS, LOG_TYPE.LOGOUT, LEVEL.INFO);
    }
    res.status(200).json({ message: 'Logout successful' });
  } catch (err: any) {
    await saveLogInfo(null, err.message, LOG_TYPE.LOGOUT, LEVEL.ERROR);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<any> => {
  try {
    const { refreshToken } = req.body;

    const existingToken = await prisma.token.findUnique({
      where: { refreshToken },
    });

    if (!existingToken || !existingToken.refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: existingToken.userId },
    });

    if (!existingUser) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    let tokenExpiry = null;

    const decoded = decode(existingToken.refreshToken);

    if (decoded && typeof decoded !== 'string') {
      tokenExpiry = decoded.exp;
      if (tokenExpiry) {
        
      } else {
        console.error("Expiration time not found in the token payload.");
      }
    }

    const refreshTokenExpiresAt = (tokenExpiry ?? 0) * 1000;
    if (Date.now() >= refreshTokenExpiresAt) {
      await prisma.token.delete({ where: { id: existingToken.id } });
      return res.status(401).json({ message: 'Expired refresh token' });
    }

    const payload = { id: existingUser.id, email: existingUser.email };
    const newAccessToken = sign(payload, process.env.SECRET as string, { expiresIn: '6h' });
    const newRefreshToken = sign(payload, process.env.REFRESH_SECRET as string, { expiresIn: '7d' });

    await prisma.token.update({
      where: { id: existingToken.id },
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
    });
  } catch (err) {
  
    res.status(500).json({ message: 'Internal server error: ' + err});
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        firstName : true,
        lastName  : true,
        avatarUrl : true,
        bio       : true,
        isEmailVerified: true,
        height : true,
        weight : true,
        age    : true,
        // Exclude password field
        password: false,
      },
    });
    if(!user){
      return res.status(500).json({ message: 'User not found' });
    }
    const totalPosts = await prisma.post.count({ where: { userId: user.id } });
    const communities = await prisma.communityUser.findMany({
      where: { userId: user.id },
    });
    const totalCommunities = communities.length;

    const postCommunities = await prisma.post.findMany({
      where: { userId: user.id },
      distinct: ['communityId'],
    });
    const totalPostCommunities = postCommunities.length;

    const createdAt = dayjs(user.createdAt);
    const now = dayjs();
    const durationObj = dayjs.duration(now.diff(createdAt));
    const durationMinutes = durationObj.asMinutes();
    const durationHours = durationObj.asHours();
    const durationDays = durationObj.asDays();

    let duration ="";
    if (durationMinutes < 60) {
      duration = `${Math.floor(durationMinutes)} minutes`;
    } else if (durationHours < 24) {
      duration = `${Math.floor(durationHours)} hours`;
    } else if (durationDays < 365) {
      duration = `${Math.floor(durationDays)} days`;
    } else {
      const durationYears = Math.floor(durationDays / 365);
      duration = `${durationYears} years`;
    }
    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      include: { Likes:true, Comments:true },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    let userData = {...user, totalPosts,totalCommunities,totalPostCommunities, duration,posts}

    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req: DecodedRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { userId } = req.userData!
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        firstName : true,
        lastName  : true,
        avatarUrl : true,
        bio       : true,
        isEmailVerified: true,
        height : true,
        weight : true,
        age    : true,
        // Exclude password field
        password: false,
      },
    });
    if(!user){
      return res.status(500).json({ message: 'User not found' });
    }
    const totalPosts = await prisma.post.count({ where: { userId: user.id } });
    const communities = await prisma.communityUser.findMany({
      where: { userId: user.id },
    });
    const totalCommunities = communities.length;

    const postCommunities = await prisma.post.findMany({
      where: { userId: user.id },
      distinct: ['communityId'],
    });
    const totalPostCommunities = postCommunities.length;

    const createdAt = dayjs(user.createdAt);
    const now = dayjs();
    const durationObj = dayjs.duration(now.diff(createdAt));
    const durationMinutes = durationObj.asMinutes();
    const durationHours = durationObj.asHours();
    const durationDays = durationObj.asDays();

    let duration ="";
    if (durationMinutes < 60) {
      duration = `${Math.floor(durationMinutes)} minutes`;
    } else if (durationHours < 24) {
      duration = `${Math.floor(durationHours)} hours`;
    } else if (durationDays < 365) {
      duration = `${Math.floor(durationDays)} days`;
    } else {
      const durationYears = Math.floor(durationDays / 365);
      duration = `${durationYears} years`;
    }
    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      include: { Likes:true, Comments:true },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    let userData = {...user, totalPosts,totalCommunities,totalPostCommunities, duration,posts}

    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};

export const addUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { username,firstName,lastName, email, password, isConsentGiven } = req.body;
  try {
    const existingEmailUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmailUser) {
      return res.status(400).json({ message: 'Email is already in use, Please sign In' });
    }

    // Check if the username is already in use
    const existingUsernameUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsernameUser) {
      return res.status(400).json({ message: 'Username is already in use' });
    }
    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Determine the user role based on the email domain
    const emailDomain = email.split('@')[1];
    const role = emailDomain === 'mod.formai.com' ? 'moderator' : 'general';

    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        createdAt: new Date(), 
      },
    });

    if (!newUser) {
      throw new Error('Failed to add user');
    }
    
    // If consent is not given, return a success message
    if (isConsentGiven === false) {
      res.status(201).json({ message: 'User added successfully' });
    } else {
      // Otherwise, proceed with additional processing (e.g., sending a welcome email)
      req.user = newUser;
      next();
    }
  } catch (err:any) {
    res.status(400).json({ message: 'Failed to add user', error: err.message });
  }
};

export const updateInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { userId, height, weight, age, bio,isConsentGiven, avatarUrl  } = req.body;

    // Validate user existence
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create an object to hold the fields to update
    const updateData: Partial<{ height: number; weight: number; age: number; bio: string,  avatarUrl: string }> = {};

    if (height !== undefined) updateData.height = height;
    if (weight !== undefined) updateData.weight = weight;
    if (age !== undefined) updateData.age = age;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    // Update user's personal details only if there are fields to update
    if (Object.keys(updateData).length > 0) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      return res.status(200).json({ message: 'Personal details updated successfully', userId: updatedUser });
    }

    // If no fields are provided for update, return a message
    res.status(400).json({ message: 'No fields provided for update' });
  } catch (err: any) {
    res.status(400).json({ message: 'Failed to update personal details', error: err.message });
  }
};


export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  const USER = process.env.EMAIL as string;
  const PASS = process.env.PASSWORD as string;
  const EMAIL_SERVICE = process.env.EMAIL_SERVICE as string;
  const CLIENT_URL = process.env.CLIENT_URL as string;

  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'No user found with that email address' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: hashedToken,
        tokenExpires,
      },
    });

    const resetLink = `${CLIENT_URL}/user/reset-password/${resetToken}`;
  
    const transporter = createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: USER,
        pass: PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"FormAI" <${USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: resetPasswordHTML(user.firstName, resetLink),
    });

    await prisma.email.create({
      data: {
        email,
        verificationCode: resetToken,
        messageId: info.messageId,
        forId: 3,
      },
    });
    await saveLogInfo(req, MESSAGE.PASSWORD_RESET_EMAIL_SENT, LOG_TYPE.SIGN_IN, LEVEL.INFO);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err:any) {
    await saveLogInfo(req, MESSAGE.PASSWORD_RESET_ERROR + err.message, LOG_TYPE.SIGN_IN, LEVEL.ERROR);
    console.error('Could not send email. There could be an issue with the provided credentials or the email service.', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        token: hashedToken,
        tokenExpires: { gt: new Date() },
      },
    });

    if (!resetRecord) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }
    passwordSchema.parse(password);
    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.passwordReset.delete({
      where: { id: resetRecord.id },
    });

    await saveLogInfo(req, MESSAGE.PASSWORD_RESET_SUCCESS, LOG_TYPE.SIGN_IN, LEVEL.INFO);

    res.status(200).json({ message: 'Password has been reset' });
  } catch (err:any) {
    await saveLogInfo(req, MESSAGE.SIGN_IN_ERROR + err.message, LOG_TYPE.SIGN_IN, LEVEL.ERROR);
    res.status(500).json({ message: 'Something went wrong: ' + err.message });
  }
};
