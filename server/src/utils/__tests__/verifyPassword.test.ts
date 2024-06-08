import { hashPassword } from '../createPassword';
import { verifyPassword } from '../verifyPassword';

describe('verifyPassword', () => {
  it('should verify a correct password successfully', async () => {
    const password = 'Test@123';
    const hash = await hashPassword(password);

    const isValid = await verifyPassword(hash, password);
    expect(isValid).toBe(true);
  });

  it('should fail verification for an incorrect password', async () => {
    const password = 'Test@123';
    const hash = await hashPassword(password);

    const isValid = await verifyPassword(hash, 'WrongPassword');
    expect(isValid).toBe(false);
  });

  it('should return false for an invalid hash format', async () => {
    const invalidHash = 'invalid-hash-format';
    const password = 'Test@123';

    const isValid = await verifyPassword(invalidHash, password);
    expect(isValid).toBe(false);
  });

  it('should throw an error if the password verification fails', async () => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});

    // Mock argon2.hash to throw an error
    jest.mock('argon2', () => ({
      hash: jest.fn().mockRejectedValue(new Error('Verification failed')),
    }));

    const hash = await hashPassword('Test@123');
    await expect(verifyPassword(hash, 'Test@123')).rejects.toThrow('Error verifying password');

    jest.restoreAllMocks();
  });
});
