import request from 'supertest';
import express from 'express';
import router from '../auth.route';
import { getSignedUrl, uploadFile } from '../../controllers/data.controller';

// Mock the controller functions
jest.mock('../../controllers/data.controller', () => ({
  getSignedUrl: jest.fn((req, res) => res.status(200).send('mockSignedUrl')),
  uploadFile: jest.fn((req, res) => res.status(200).send('File uploaded')),
}));

const app = express();
app.use(express.json()); // For parsing application/json
app.use('/auth', router);

describe('Auth Routes', () => {
  it('should return a signed URL for /getsignedurl', async () => {
    const response = await request(app).get('/auth/getsignedurl');
    expect(response.status).toBe(200);
    expect(response.text).toBe('mockSignedUrl');
  });

  it('should upload a file for /upload', async () => {
    const response = await request(app)
      .post('/auth/upload')
      .send({ file: 'mockFileContent' });
    expect(response.status).toBe(200);
    expect(response.text).toBe('File uploaded');
  });
});
