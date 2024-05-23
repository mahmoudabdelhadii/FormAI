import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import prisma from '../../utils/prisma'; // Assuming prisma client is exported from utils/prisma
import { verifyLoginHTML } from '../../utils/emailTemplates';
import { query, validationResult } from 'express-validator';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';


export const verifyLoginValidation = [
  query('email').isEmail().normalizeEmail(),
  query('id').isLength({ min: 24, max: 24 }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

export const sendLoginVerificationEmail = async (req: Request, res: Response) => {
  const USER = process.env.EMAIL as string;
  const PASS = process.env.PASSWORD as string;

  const currentContextData = req.body.currentContextData;

  const { email, name } = req.body.user;

  const id = currentContextData.id;
  const verificationLink = `${CLIENT_URL}/verify-login?id=${id}&email=${email}`;
  const blockLink = `${CLIENT_URL}/block-device?id=${id}&email=${email}`;

  try {
    const transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: USER,
        pass: PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"FormAI" <${USER}>`,
      to: email,
      subject: 'Action Required: Verify Recent Login',
      html: verifyLoginHTML(name, verificationLink, blockLink, currentContextData),
    });

    await prisma.email.create({
      data: {
        email,
        verificationCode: id,
        messageId: info.messageId,
        for: 1,
      },
    });

    res.status(401).json({
      message: 'Access blocked due to suspicious activity. Verification email was sent to your email address.',
    });
  } catch (err) {
    console.error('Could not send email. There could be an issue with the provided credentials or the email service.', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const verifyLogin = async (req: Request, res: Response) => {
  const { id, email } = req.query as { id: string; email: string };

  try {
    const suspiciousLogin = await prisma.suspiciousLogin.findUnique({ where: { id } });

    if (!suspiciousLogin || suspiciousLogin.email !== email) {
      return res.status(400).json({ message: 'Invalid verification link' });
    }

    if (!suspiciousLogin.userId) {
        return res.status(400).json({ message: 'no user Id' });
      }

    await prisma.context.create({
      data: {
        userId: suspiciousLogin.userId,
        ip: suspiciousLogin.ip,
        city: suspiciousLogin.city,
        country: suspiciousLogin.country,
        device: suspiciousLogin.device,
        deviceType: suspiciousLogin.deviceType,
        browser: suspiciousLogin.browser,
        os: suspiciousLogin.os,
        platform: suspiciousLogin.platform,
      },
    });

    await prisma.suspiciousLogin.update({
      where: { id },
      data: { isTrusted: true, isBlocked: false },
    });

    res.status(200).json({ message: 'Login verified' });
  } catch (err) {
    res.status(500).json({ message: 'Could not verify your login' });
  }
};

export const blockLogin = async (req: Request, res: Response) => {
  const { id, email } = req.query as { id: string; email: string };

  try {
    const suspiciousLogin = await prisma.suspiciousLogin.findUnique({ where: { id } });

    if (!suspiciousLogin || suspiciousLogin.email !== email) {
      return res.status(400).json({ message: 'Invalid verification link' });
    }

    await prisma.suspiciousLogin.update({
      where: { id },
      data: { isBlocked: true, isTrusted: false },
    });

    res.status(200).json({ message: 'Login blocked' });
  } catch (err) {
    res.status(500).json({ message: 'Could not block your login' });
  }
};