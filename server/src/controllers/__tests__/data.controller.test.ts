import request from 'supertest';
import express, { Request, Response } from 'express';
import { getSignedUrl, uploadFile } from '../../controllers/data.controller';
import generateSignedUrl from '../../utils/SignedUrl';
import busboy from 'busboy';
import S3ClientSingleton from '../../utils/s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { PassThrough } from 'stream';

jest.mock('../../utils/SignedUrl');
jest.mock('../../utils/s3Client');
jest.mock('busboy');
jest.mock('@aws-sdk/client-s3');

const s3 = {
  send: jest.fn()
};

S3ClientSingleton.getInstance = jest.fn().mockReturnValue(s3);

const app = express();
app.use(express.json());
app.get('/signed-url', getSignedUrl);
app.post('/upload-file', uploadFile);

describe('File Controller Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSignedUrl', () => {
    it('should return a signed URL with an expire time', async () => {
      (generateSignedUrl as jest.Mock).mockResolvedValue('signed-url-with-expire');

      const response = await request(app).get('/signed-url').query({ objectPath: 'path/to/object', expireTime: '600' });

      expect(response.status).toBe(200);
      expect(response.body).toBe('signed-url-with-expire');
      expect(generateSignedUrl).toHaveBeenCalledWith('path/to/object', 600);
    });

    it('should return a signed URL without an expire time', async () => {
      (generateSignedUrl as jest.Mock).mockResolvedValue('signed-url-no-expire');

      const response = await request(app).get('/signed-url').query({ objectPath: 'path/to/object' });

      expect(response.status).toBe(200);
      expect(response.body).toBe('signed-url-no-expire');
      expect(generateSignedUrl).toHaveBeenCalledWith('path/to/object');
    });

    it('should handle errors when getting a signed URL', async () => {
      (generateSignedUrl as jest.Mock).mockRejectedValue(new Error('Internal error'));

      const response = await request(app).get('/signed-url').query({ objectPath: 'path/to/object' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal getting signed url' });
    });
  });

  describe('uploadFile', () => {
    let mockBusboy: any;

    beforeEach(() => {
      mockBusboy = {
        on: jest.fn(),
        end: jest.fn(),
        emit: jest.fn()
      };
      (busboy as jest.Mock).mockReturnValue(mockBusboy);
    });

    it('should upload a file successfully', async () => {
      const fileStream = new PassThrough();
      fileStream.end('file-content');

      const mockFile = {
        fieldname: 'file',
        file: fileStream,
        filename: 'testfile.txt',
        encoding: '7bit',
        mimetype: 'text/plain'
      };

      mockBusboy.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'file') {
          callback(mockFile.fieldname, mockFile.file, mockFile.filename, mockFile.encoding, mockFile.mimetype);
        }
        if (event === 'finish') {
          callback();
        }
      });

      const uploadData = { Location: 'https://s3.bucket/testfile.txt' };
      s3.send.mockResolvedValue(uploadData);

      const response = await request(app).post('/upload-file').attach('file', Buffer.from('file-content'), 'testfile.txt');

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'File uploaded successfully', data: uploadData });
    });

    it('should handle errors during file upload', async () => {
      const fileStream = new PassThrough();
      fileStream.end('file-content');

      const mockFile = {
        fieldname: 'file',
        file: fileStream,
        filename: 'testfile.txt',
        encoding: '7bit',
        mimetype: 'text/plain'
      };

      mockBusboy.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'file') {
          callback(mockFile.fieldname, mockFile.file, mockFile.filename, mockFile.encoding, mockFile.mimetype);
        }
        if (event === 'finish') {
          callback();
        }
      });

      s3.send.mockRejectedValue(new Error('Upload error'));

      const response = await request(app).post('/upload-file').attach('file', Buffer.from('file-content'), 'testfile.txt');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'File upload failed', error: 'Upload error' });
    });

    it('should handle busboy errors', async () => {
      const mockFile = {
        fieldname: 'file',
        file: new PassThrough(),
        filename: 'testfile.txt',
        encoding: '7bit',
        mimetype: 'text/plain'
      };

      mockBusboy.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'file') {
          callback(mockFile.fieldname, mockFile.file, mockFile.filename, mockFile.encoding, mockFile.mimetype);
        }
        if (event === 'error') {
          callback(new Error('Busboy error'));
        }
        if (event === 'finish') {
          callback();
        }
      });

      const response = await request(app).post('/upload-file').attach('file', Buffer.from('file-content'), 'testfile.txt');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'File upload failed', error: 'Busboy error' });
    });
  });
});
