import { createUserSchema, updateUserSchema, UserSchema } from '../user.model';
import { z } from 'zod';

describe('UserSchema validation', () => {
  it('should validate a correct user object', () => {
    const validUser = {
      id: 'c9d4c7e8-ec1b-4c67-9656-7b4b8a3f9e5d',
      username: 'validUser123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'P@ssw0rd!',
      avatarUrl: 'http://example.com/avatar.jpg',
      bio: 'This is a bio',
      createdAt: new Date(),
      isEmailVerified: true,
      height: 1.8,
      weight: 75,
      age: 30,
    };

    expect(() => UserSchema.parse(validUser)).not.toThrow();
  });

  it('should fail validation for a user object with missing required fields', () => {
    const invalidUser = {
      id: 'c9d4c7e8-ec1b-4c67-9656-7b4b8a3f9e5d',
      username: 'validUser123',
      // missing firstName
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'P@ssw0rd!',
      avatarUrl: 'http://example.com/avatar.jpg',
      bio: 'This is a bio',
      createdAt: new Date(),
      isEmailVerified: true,
      height: 1.8,
      weight: 75,
      age: 30,
    };

    expect(() => UserSchema.parse(invalidUser)).toThrow(z.ZodError);
  });

  it('should fail validation for a user object with invalid email', () => {
    const invalidUser = {
      id: 'c9d4c7e8-ec1b-4c67-9656-7b4b8a3f9e5d',
      username: 'validUser123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      password: 'P@ssw0rd!',
      avatarUrl: 'http://example.com/avatar.jpg',
      bio: 'This is a bio',
      createdAt: new Date(),
      isEmailVerified: true,
      height: 1.8,
      weight: 75,
      age: 30,
    };

    expect(() => UserSchema.parse(invalidUser)).toThrow(z.ZodError);
  });

  it('should validate a correct user object for creation', () => {
    const validUser = {
      username: 'validUser123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'P@ssw0rd!',
      avatarUrl: 'http://example.com/avatar.jpg',
      bio: 'This is a bio',
      createdAt: new Date(),
      isEmailVerified: true,
      height: 1.8,
      weight: 75,
      age: 30,
    };

    expect(() => createUserSchema.parse(validUser)).not.toThrow();
  });

  it('should fail validation for creation with missing fields', () => {
    const invalidUser = {
      username: 'validUser123',
      firstName: 'John',
      lastName: 'Doe',
      // missing email
      password: 'P@ssw0rd!',
      avatarUrl: 'http://example.com/avatar.jpg',
      bio: 'This is a bio',
      createdAt: new Date(),
      isEmailVerified: true,
      height: 1.8,
      weight: 75,
      age: 30,
    };

    expect(() => createUserSchema.parse(invalidUser)).toThrow(z.ZodError);
  });

  it('should validate a correct user object for update', () => {
    const validUserUpdate = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    expect(() => updateUserSchema.parse(validUserUpdate)).not.toThrow();
  });

  it('should fail validation for update with invalid fields', () => {
    const invalidUserUpdate = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
    };

    expect(() => updateUserSchema.parse(invalidUserUpdate)).toThrow(z.ZodError);
  });

  it('should fail validation for a password missing an uppercase letter', () => {
    const invalidUser = {
      username: 'validUser123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'p@ssw0rd1', // Missing uppercase letter
      avatarUrl: 'http://example.com/avatar.jpg',
      bio: 'This is a bio',
      createdAt: new Date(),
      isEmailVerified: true,
      height: 1.8,
      weight: 75,
      age: 30,
    };

    expect(() => createUserSchema.parse(invalidUser)).toThrow(z.ZodError);
  });

  it('should fail validation for a password missing a special character', () => {
    const invalidUser = {
      username: 'validUser123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Passw0rd1', // Missing special character
      avatarUrl: 'http://example.com/avatar.jpg',
      bio: 'This is a bio',
      createdAt: new Date(),
      isEmailVerified: true,
      height: 1.8,
      weight: 75,
      age: 30,
    };

    expect(() => createUserSchema.parse(invalidUser)).toThrow(z.ZodError);
  });
});
