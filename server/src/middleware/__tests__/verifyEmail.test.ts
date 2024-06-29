import { Request, Response } from 'express';
import { sendVerificationEmail, verifyEmail } from '../users/verifyEmail';
import prisma from '../../utils/prisma';
import nodemailer from 'nodemailer';
import { verifyEmailHTML } from '../../utils/emailTemplates';

// Mock the prisma client
jest.mock('../../utils/prisma', () => ({
  email: {
    create: jest.fn(),
    findFirst: jest.fn(),
    deleteMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  preferences: {
    create: jest.fn(),
  },
  suspiciousLogin: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  context: {
    create: jest.fn(),
  },
}));

// Mock nodemailer
jest.mock('nodemailer');
const sendMailMock = jest.fn();
(nodemailer.createTransport as jest.Mock).mockReturnValue({
  sendMail: sendMailMock,
});

describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendVerificationEmail', () => {
    it('should send a verification email and save it to the database', async () => {
      const req = {
        body: { email: 'test@example.com', firstName: 'John' },
      } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      await sendVerificationEmail(req, res);

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        service: 'gmail',
        auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
      });
      expect(sendMailMock).toHaveBeenCalled();
      expect(prisma.email.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: `Verification email was successfully sent to test@example.com`,
      });
    });

    it('should handle errors when sending email fails', async () => {
      const req = {
        body: { email: 'test@example.com', firstName: 'John' },
      } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      sendMailMock.mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      await sendVerificationEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' });
    });
  });

  describe('verifyEmail', () => {
    it('should verify email and update user status', async () => {
      const req = {
        query: { code: '12345', email: 'test@example.com' },
        user: {},
      } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ isEmailVerified: false });
      (prisma.email.findFirst as jest.Mock).mockResolvedValue({ email: 'test@example.com', verificationCode: '12345' });
      (prisma.user.update as jest.Mock).mockResolvedValue({ id: 'user-id', email: 'test@example.com' });

      await verifyEmail(req, res, next);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        data: { isEmailVerified: true },
      });
      expect(prisma.email.deleteMany).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(prisma.preferences.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-id',
          enableContextBasedAuth: true,
        },
      });
      expect(req.user).toEqual({ userId: 'user-id', email: 'test@example.com' });
      expect(next).toHaveBeenCalled();
    });

    it('should return error if email is already verified', async () => {
      const req = {
        query: { code: '12345', email: 'test@example.com' },
      } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ isEmailVerified: true });

      await verifyEmail(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email is already verified' });
    });

    it('should return error if verification code is invalid', async () => {
      const req = {
        query: { code: '12345', email: 'test@example.com' },
      } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ isEmailVerified: false });
      (prisma.email.findFirst as jest.Mock).mockResolvedValue(null);

      await verifyEmail(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Verification code is invalid or has expired' });
    });
  });
});
