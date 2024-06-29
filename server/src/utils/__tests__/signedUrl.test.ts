import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';
import generateSignedUrl from '../SignedUrl';

jest.mock('@aws-sdk/cloudfront-signer');
jest.mock('fs');
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('generateSignedUrl', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // clear the cache
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // restore old environment
  });

  it('should throw an error if CLOUDFRONT_KEY_PAIR_ID is not set', async () => {
    process.env.CLOUDFRONT_KEY_PAIR_ID = '';

    await expect(generateSignedUrl('path/to/object')).rejects.toThrow(
      'Environment variable CLOUDFRONT_KEY_PAIR_ID must be set.'
    );
  });

  it('should throw an error if neither CLOUDFRONT_PRIVATE_KEY nor CLOUDFRONT_PRIVATE_KEY_PATH is set', async () => {
    process.env.CLOUDFRONT_KEY_PAIR_ID = 'test-key-pair-id';
    process.env.CLOUDFRONT_PRIVATE_KEY = '';
    process.env.CLOUDFRONT_PRIVATE_KEY_PATH = '';

    await expect(generateSignedUrl('path/to/object')).rejects.toThrow(
      'Environment variables CLOUDFRONT_PRIVATE_KEY or CLOUDFRONT_PRIVATE_KEY_PATH must be set.'
    );
  });

  it('should read the private key from file if CLOUDFRONT_PRIVATE_KEY_PATH is set', async () => {
    process.env.CLOUDFRONT_KEY_PAIR_ID = 'test-key-pair-id';
    process.env.CLOUDFRONT_PRIVATE_KEY = '';
    process.env.CLOUDFRONT_PRIVATE_KEY_PATH = 'path/to/private/key';
    process.env.CLOUDFRONT_DOMAIN = 'example.cloudfront.net';

    (readFileSync as jest.Mock).mockReturnValue('private-key-content');
    (getSignedUrl as jest.Mock).mockReturnValue('signed-url');

    const result = await generateSignedUrl('path/to/object');

    expect(readFileSync).toHaveBeenCalledWith(resolve('path/to/private/key'), 'utf8');
    expect(getSignedUrl).toHaveBeenCalledWith({
      url: 'https://example.cloudfront.net/path/to/object',
      keyPairId: 'test-key-pair-id',
      privateKey: 'private-key-content',
      dateLessThan: expect.any(String),
    });
    expect(result).toBe('signed-url');
  });

  it('should use the private key from environment variable if set', async () => {
    process.env.CLOUDFRONT_KEY_PAIR_ID = 'test-key-pair-id';
    process.env.CLOUDFRONT_PRIVATE_KEY = 'env-private-key';
    process.env.CLOUDFRONT_PRIVATE_KEY_PATH = '';
    process.env.CLOUDFRONT_DOMAIN = 'example.cloudfront.net';

    (getSignedUrl as jest.Mock).mockReturnValue('signed-url');

    const result = await generateSignedUrl('path/to/object');

    expect(readFileSync).not.toHaveBeenCalled();
    expect(getSignedUrl).toHaveBeenCalledWith({
      url: 'https://example.cloudfront.net/path/to/object',
      keyPairId: 'test-key-pair-id',
      privateKey: 'env-private-key',
      dateLessThan: expect.any(String),
    });
    expect(result).toBe('signed-url');
  });
});
