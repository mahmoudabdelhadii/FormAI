import * as crypto from 'crypto';
import argon2 from 'argon2';

const PASSWORD_LENGTH = 32; // Length of the derived key

// Function to hash the password
export const hashPassword = async (password: string): Promise<string> => {
  try {
    // Generate a salt
    const salt = crypto.randomBytes(16);

    // Hash the password using argon2 with the generated salt
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      salt: salt,
      hashLength: PASSWORD_LENGTH,
      timeCost: 3,
      memoryCost: 4096,
      parallelism: 4,
    });
    
    // Parse the hash string to extract parameters and values
    const parts = hash.split('$');
    const version = parts[2];
    const params = parts[3];
    const saltBase64 = parts[4];
    const hashValue = parts[5];

    // Extract the parameters
    const [mParam, tParam, pParam] = params.split(',');
    const memoryCost = mParam.split('=')[1];
    const timeCost = tParam.split('=')[1];
    const parallelism = pParam.split('=')[1];

    // Create custom format {X-ARGON2}argon2id:iterations:memoryCost:parallelism:salt:hash
    const customFormat = `{X-ARGON2}argon2id:${timeCost}:${memoryCost}:${parallelism}:${saltBase64}:${hashValue}`;
    return customFormat;
  } catch (err) {
    console.error('Error hashing password:', err); // Debugging: Log the error
    throw new Error('Error hashing password: ' + err);
  }
};
