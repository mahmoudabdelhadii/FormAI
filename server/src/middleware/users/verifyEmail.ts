import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import { query, validationResult } from 'express-validator';
import prisma from '../../utils/prisma';
import { verifyEmailHTML } from '../../utils/emailTemplates';
import { DecodedRequest } from '../../types/interfaces';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';

export const verifyEmailValidation = [
  query('email').isEmail().normalizeEmail(),
  query('code').isLength({ min: 5, max: 5 }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * Middleware to send an email with a verification code to the user for email verification
 * The email contains a link with the verification code and the user's email address
 * The middleware first checks the email and password credentials in the environment variables
 * and then creates a transporter object using the nodemailer library
 * The transporter object is then used to send an email with the verification link
 * The email is also saved in the prisma database with the email address, verification code, and message id
 * The message id is the id of the mail sent using the transporter object
 * @param req The request object containing the user's email and first name
 * @param res The response object which is used to send a JSON response
 * @returns The response object with a JSON containing a message indicating whether the email was sent successfully
 */
export const sendVerificationEmail = async (req: Request, res: Response) => {
  const USER = process.env.EMAIL as string;
  const PASS = process.env.PASSWORD as string;

  const { email, firstName } = req.body;

  const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
  const verificationLink = `${CLIENT_URL}/auth/verify?code=${verificationCode}&email=${email}`;

  try {
    /**
     * Create a transporter object to send emails using the nodemailer library
     * The transporter object is created with the email service and the credentials found in the environment variables
     */
    const transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: USER,
        pass: PASS,
      },
    });

    /**
     * Send an email with the verification link to the user using the transporter object
     * The email contains the user's first name and the verification link
     * The email is also saved in the prisma database with the email address, verification code, and message id
     */
    const info = await transporter.sendMail({
      from: `"FormAI" <${USER}>`,
      to: email,
      subject: 'FormAI: Verify your email address',
      html: verifyEmailHTML(firstName, verificationLink, verificationCode),
    });

    /**
     * Save the email in the prisma database with the email address, verification code, and message id
     * The message id is the id of the mail sent using the transporter object
     */
    await prisma.email.create({
      data: {
        email,
        verificationCode,
        messageId: info.messageId,
        forId: 1,
      },
    });

    res.status(200).json({
      message: `Verification email was successfully sent to ${email}`,
    });
  } catch (err) {
    /**
     * Handle the error when sending the email and log it to the console
     * The error could be due to invalid credentials or a problem with the email service
     */
    console.error('Could not send verification email. There could be an issue with the provided credentials or the email service.', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const verifyEmail = async (req: DecodedRequest, res: Response, next: NextFunction) => {
  const { code, email } = req.query as { code: string; email: string };

  try {
    const [isVerified, verification] = await Promise.all([
      prisma.user.findUnique({
        where: { email },
        select: { isEmailVerified: true },
      }),
      prisma.email.findFirst({
        where: { email, verificationCode: code },
      }),
    ]);

    if (isVerified?.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    if (!verification) {
      return res.status(400).json({ message: 'Verification code is invalid or has expired' });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });

    await prisma.$transaction([
      prisma.email.deleteMany({ where: { email } }),
      prisma.preferences.create({
        data: {
          userId: updatedUser.id,
          enableContextBasedAuth: true,
        },
      }),
    ]);

    req.user = {userId:updatedUser.id,email:updatedUser.email};
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
