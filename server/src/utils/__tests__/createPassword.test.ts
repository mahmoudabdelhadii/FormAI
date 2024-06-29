import { hashPassword } from '../createPassword';

describe('hashPassword', () => {
  it('should hash a password correctly', async () => {
    const password = 'Test@123';
    const hash = await hashPassword(password);

    // Verify the format of the custom hash
    expect(hash).toMatch(/^\{X-ARGON2\}argon2id:\d+:\d+:\d+:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+$/);

    const parts = hash.split(':');
    expect(parts.length).toBe(6);
    expect(parts[0]).toBe('{X-ARGON2}argon2id');
  });

  it('should throw an error if the password hashing fails', async () => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});

    // Mock argon2.hash to throw an error
    jest.mock('argon2', () => ({
      hash: jest.fn().mockRejectedValue(new Error('Hashing failed')),
    }));

    const password = 'Test@123';
    await expect(hashPassword(password)).rejects.toThrow('Error hashing password');

    jest.restoreAllMocks();
  });
});
