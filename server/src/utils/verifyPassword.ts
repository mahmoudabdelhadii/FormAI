import argon2 from 'argon2';
import * as crypto from "node:crypto"
// Verify a password attempt against the stored custom format password
export async function verifyPassword(storedPassword: string, passwordAttempt: string): Promise<boolean> {
    try {
      // Parse the custom format {X-ARGON2}argon2id:iterations:memoryCost:parallelism:salt:hash
      const parts = storedPassword.split(':');
      console.log(parts)
      if (parts.length !== 6 || !parts[0].startsWith('{X-ARGON2}')) {
        return false; // Invalid format
      }
      
      const algorithm = parts[0];
      const iterations = parseInt(parts[1], 10);
      const memoryCost = parseInt(parts[2], 10);
      const parallelism = parseInt(parts[3], 10);
      const salt = parts[4];
      const hashValue = parts[5];
      
      const hash = await argon2.hash(passwordAttempt, {
        type: argon2.argon2id,
        salt: Buffer.from(salt, 'base64'),
        hashLength: 32,
        timeCost: iterations,
        memoryCost: memoryCost,
        parallelism: parallelism,
      });
      console.log(hash)
      console.log(storedPassword)
      // Extract the generated hash part and compare it with the stored hash
      const generatedHashValue = hash.split('$')[5];
      console.log(generatedHashValue)
      return generatedHashValue === hashValue;
    } catch (error) {
      throw new Error('Error verifying password');
    }
  }
  