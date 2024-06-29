import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { postValidator, userValidator, commentValidator, passwordValidator, emailValidator } from '../validators/validator';
import { PostSchema } from '../../models/post.model';
import { UserSchema } from '../../models/user.model';
import CommentSchema from '../../models/comment.model';

// Middleware function to create a simple express app for testing
const createTestApp = (validator: (req: Request, res: Response, next: NextFunction) => void) => {
  const app = express();
  app.use(express.json());
  app.post('/test', validator, (req, res) => {
    res.status(200).send('Validated');
  });
  return app;
};

describe('Validation Middleware', () => {

  // Test cases for Post validation
  describe('Post Validation', () => {
    it('should validate a valid post request body', async () => {
      const app = createTestApp(postValidator);

      const validPost = {
        id: 1,
        Content: 'This is a valid post content',
        fileUrl: 'https://example.com/file.png',
        community: 1,
        user: 'valid-user-id',
        caption: 'A valid caption',
      };

      const response = await request(app)
        .post('/test')
        .send(validPost);

      expect(response.status).toBe(200);
      expect(response.text).toBe('Validated');
    });

    it('should return 400 for an invalid post request body (missing fileUrl)', async () => {
      const app = createTestApp(postValidator);

      const invalidPost = {
        id: 1,
        Content: 'This is a valid post content',
        community: 1,
        user: 'valid-user-id',
        caption: 'A valid caption',
      };

      const response = await request(app)
        .post('/test')
        .send(invalidPost);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].path).toBe('fileUrl');
    });
  });

  // Test cases for User validation
  describe('User Validation', () => {
    it('should validate a valid user request body', async () => {
      const app = createTestApp(userValidator);

      const validUser = {
        
        username: 'validuser',
        firstName: 'John',
        lastName: 'Doe',
        email: 'valid@example.com',
        password: 'ValidPass1!',
      };

      const response = await request(app)
        .post('/test')
        .send(validUser);

      expect(response.status).toBe(200);
      expect(response.text).toBe('Validated');
    });

    it('should return 400 for an invalid user request body (short username)', async () => {
      const app = createTestApp(userValidator);

      const invalidUser = {
        
        username: 'us',
        firstName: 'John',
        lastName: 'Doe',
        email: 'valid@example.com',
        password: 'ValidPass1!',
      };

      const response = await request(app)
        .post('/test')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].path).toBe('username');
    });
  });

  // Test cases for Comment validation
  describe('Comment Validation', () => {
    it('should validate a valid comment request body', async () => {
      const app = createTestApp(commentValidator);

      const validComment =  'This is a valid comment'
    

      const response = await request(app)
        .post('/test')
        .send(validComment);

      expect(response.status).toBe(200);
      expect(response.text).toBe('Validated');
    });

    it('should return 400 for an invalid comment request body (missing userId)', async () => {
      const app = createTestApp(commentValidator);

      const invalidComment = 'This is a valid comment'
      
      

      const response = await request(app)
        .post('/test')
        .send(invalidComment);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].path).toBe('userId');
    });
  });

  // Test cases for Password validation
  describe('Password Validation', () => {
    it('should return 400 for a password without a number', async () => {
      const app = createTestApp(passwordValidator);

      const invalidPassword =  'NoNumber!'


      const response = await request(app)
        .post('/test')
        .send(invalidPassword);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].path).toBe('password');
    });

    it('should return 400 for a password without a special character', async () => {
      const app = createTestApp(passwordValidator);

      const invalidPassword = 'NoSpecialChar1'
      

      const response = await request(app)
        .post('/test')
        .send(invalidPassword);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].path).toBe('password');
    });
  });

  // Test cases for Email validation
  describe('Email Validation', () => {
    it('should validate a valid email request body', async () => {
      const app = createTestApp(emailValidator);

      const validEmail =  'valid@example.com'

      const response = await request(app)
        .post('/test')
        .send(validEmail);

      expect(response.status).toBe(200);
      expect(response.text).toBe('Validated');
    });

    it('should return 400 for an invalid email request body', async () => {
      const app = createTestApp(emailValidator);

      const invalidEmail = 'invalid-email'

      const response = await request(app)
        .post('/test')
        .send(invalidEmail);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].path).toBe('email');
    });
  });
});
