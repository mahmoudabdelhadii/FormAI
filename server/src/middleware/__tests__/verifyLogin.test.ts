import { Request, Response } from 'express';
import { sendLoginVerificationEmail, verifyLogin, blockLogin } from '../users/verifyLogin';
import prisma from '../../utils/prisma';
import nodemailer from 'nodemailer';
import { verifyLoginHTML } from '../../utils/emailTemplates';

// Mock the prisma client
jest.mock('../../utils/prisma', () => ({
  email: {
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

describe('Login Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendLoginVerificationEmail', () => {
    it('should send a login verification email and save it to the database', async () => {
      const req = {
        body: {
          currentContextData: { id: 'test-id' },
          user: { email: 'test@example.com', name: 'John' },
        },
      } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      await sendLoginVerificationEmail(req, res);

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        service: 'gmail',
        auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
      });
      expect(sendMailMock).toHaveBeenCalled();
      expect(prisma.email.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access blocked due to suspicious activity. Verification email was sent to your email address.',
      });
    });

    it('should handle errors when sending email fails', async () => {
      const req = {
        body: {
          currentContextData: { id: 'test-id' },
          user: { email: 'test@example.com', name: 'John' },
        },
      } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      sendMailMock.mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      await sendLoginVerificationEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' });
    });
  });

  describe('verifyLogin', () => {
    it('should verify login and update suspicious login status', async () => {
      const req = {
        query: { id: 'test-id', email: 'test@example.com' },
      } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (prisma.suspiciousLogin.findUnique as jest.Mock).mockResolvedValue({ id: 'test-id', email: 'test@example.com', userId: 'user-id' });

      await verifyLogin(req, res);

      expect(prisma.context.create).toHaveBeenCalled();
      expect(prisma.suspiciousLogin.update).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: { isTrusted: true, isBlocked: false },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login verified' });
    });

    it('should return error if verification link is invalid', async () => {
      const req = {
        query: { id: 'test-id', email: 'test@example.com' },
      } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (prisma.suspiciousLogin.findUnique as jest.Mock).mockResolvedValue(null);

      await verifyLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid verification link' });
    });
  });

  describe('blockLogin', () => {
    it('should block login and update suspicious login status', async () => {
      const req = {
        query: { id: 'test-id', email: 'test@example.com' },
      } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (prisma.suspiciousLogin.findUnique as jest.Mock).mockResolvedValue({ id: 'test-id', email: 'test@example.com' });

      await blockLogin(req, res);

      expect(prisma.suspiciousLogin.update).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: { isBlocked: true, isTrusted: false },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login blocked' });
    });

    it('should return error if verification link is invalid', async () => {
      const req = {
        query: { id: 'test-id', email: 'test@example.com' },
      } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (prisma.suspiciousLogin.findUnique as jest.Mock).mockResolvedValue(null);

      await blockLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid verification link' });
    });
  });
});
