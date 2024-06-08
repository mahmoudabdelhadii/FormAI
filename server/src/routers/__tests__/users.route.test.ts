import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import router from '../users.route';
import prisma from '../../utils/__mocks__/prisma'; // Using the existing Prisma client

const app = express();
app.use(express.json());
app.use('/user', router);

describe('User Routes', () => {
  


  it('should sign in a user', async () => {
    // First, create a user
    await prisma.user.create({
      data: {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: await bcrypt.hash('Testpass12*', 10), // Use bcrypt for hashing the password
      },
    });

    const response = await request(app).post('/user/signin').send({ identifier: 'testuser', password: 'Testpass12*' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Signed in' });
  });

  it('should sign up a user', async () => {
    const response = await request(app).post('/user/signup').send({ username: 'testuser', firstName: 'test', lastName: 'test', email: 'test@example.com', password: 'Testpass12*' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User added' });
  });

  it('should get a public user', async () => {
    // First, create a user
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Testpass12*', // Use bcrypt for hashing the password
      },
    });

    const response = await request(app).get(`/user/public-users/${user.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: user.id, name: 'Test User' });
  });

  it('should get all public users', async () => {
    await prisma.user.createMany({
      data: [
        { username: 'testuser1', firstName: 'Test1', lastName: 'User1', email: 'test1@example.com', password: 'Testpass12*' },
        { username: 'testuser2', firstName: 'Test2', lastName: 'User2', email: 'test2@example.com', password: 'Testpass12*' },
      ],
    });

    const response = await request(app).get('/user/public-users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ username: 'testuser1' }),
      expect.objectContaining({ username: 'testuser2' }),
    ]));
  });

  it('should follow a user', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Testpass12*', // Use bcrypt for hashing the password
      },
    });

    const response = await request(app).patch(`/user/${user.id}/follow`).send({ userId: user.id });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User followed' });
  });

  it('should unfollow a user', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Testpass12*', // Use bcrypt for hashing the password
      },
    });

    const response = await request(app).patch(`/user/${user.id}/unfollow`).send({ userId: user.id });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User unfollowed' });
  });

  it('should get following users', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Testpass12*', // Use bcrypt for hashing the password
      },
    });

    await prisma.relationship.create({
      data: {
        followerId: user.id,
        followingId: user.id,
      },
    });

    const response = await request(app).get('/user/following');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ username: 'testuser' }),
    ]));
  });

  it('should get user info', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Testpass12*', // Use bcrypt for hashing the password
      },
    });

    const response = await request(app).get(`/user/${user.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ id: user.id, name: 'Test User' }));
  });

  it('should update user info', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Testpass12*', // Use bcrypt for hashing the password
      },
    });

    const response = await request(app).put(`/user/${user.id}`).send({ bio: 'Updated bio' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Info updated' });
  });

  it('should refresh token', async () => {
    const response = await request(app).post('/user/refresh-token').send({ token: 'testtoken' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Token refreshed' });
  });

  it('should send forgot password email', async () => {
    await prisma.user.create({
      data: {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: await bcrypt.hash('Testpass12*', 10), // Use bcrypt for hashing the password
      },
    });

    const response = await request(app).post('/user/forgot-password').send({ email: 'test@example.com' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Password reset email sent' });
  });

  it('should reset password', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: await bcrypt.hash('Testpass12*', 10), // Use bcrypt for hashing the password
      },
    });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: hashedToken,
        tokenExpires: new Date(Date.now() + 3600000), // Token expires in 1 hour
      },
    });

    const response = await request(app).put(`/user/reset-password/${resetToken}`).send({ password: 'NewTestpass12*' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Password reset' });
  });

  it('should log out a user', async () => {
    const response = await request(app).post('/user/logout');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Logout successful' });
  });
});
