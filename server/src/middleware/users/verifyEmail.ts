import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import { query, validationResult } from 'express-validator';
import prisma from '../../utils/prisma';
import { verifyEmailHTML } from '../../utils/emailTemplates';

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

export const sendVerificationEmail = async (req: Request, res: Response) => {
  const USER = process.env.EMAIL as string;
  const PASS = process.env.PASSWORD as string;
  const { email, name } = req.body;

  const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
  const verificationLink = `${CLIENT_URL}/auth/verify?code=${verificationCode}&email=${email}`;

  try {
    const transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: USER,
        pass: PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"SocialEcho" <${USER}>`,
      to: email,
      subject: 'Verify your email address',
      html: verifyEmailHTML(name, verificationLink, verificationCode),
    });

    await prisma.email.create({
      data: {
        email,
        verificationCode,
        messageId: info.messageId,
        for: 2,
      },
    });

    res.status(200).json({
      message: `Verification email was successfully sent to ${email}`,
    });
  } catch (err) {
    console.error('Could not send verification email. There could be an issue with the provided credentials or the email service.', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
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
          user: updatedUser.id,
          enableContextBasedAuth: true,
        },
      }),
    ]);

    req.params.userId = updatedUser.id;
    req.params.email = updatedUser.email;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
