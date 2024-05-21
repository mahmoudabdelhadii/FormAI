import { z } from 'zod';
import { Prisma } from '@prisma/client';

const UserSchema = z.object({
  id: z.string().uuid().optional(), // UUID string, optional since it's usually auto-generated
  username: z.string().trim().min(3, "Username must be at least 3 characters long").max(20, "Username must be no more than 20 characters long").refine(value => /^[a-zA-Z0-9]+$/.test(value), {
    message: "Username can only contain alphanumeric characters",
  }),
  firstName: z.string().trim().min(1, "First name must be at least 1 character long"),
  lastName: z.string().trim().min(1, "Last name must be at least 1 character long"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8).superRefine((password, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;

    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }

    let errObj = {
      upperCase: { pass: true, message: "add upper case." },
      lowerCase: { pass: true, message: "add lower case." },
      specialCh: { pass: true, message: "add special ch." },
      totalNumber: { pass: true, message: "add number." },
    };

    if (countOfLowerCase < 1) {
      errObj = { ...errObj, lowerCase: { ...errObj.lowerCase, pass: false } };
    }
    if (countOfNumbers < 1) {
      errObj = {
        ...errObj,
        totalNumber: { ...errObj.totalNumber, pass: false },
      };
    }
    if (countOfUpperCase < 1) {
      errObj = { ...errObj, upperCase: { ...errObj.upperCase, pass: false } };
    }
    if (countOfSpecialChar < 1) {
      errObj = { ...errObj, specialCh: { ...errObj.specialCh, pass: false } };
    }

    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      checkPassComplexity.addIssue({
        code: "custom",
        path: ["password"],
        message: JSON.stringify(errObj), // Convert errObj to a string
      });
    }
  }), // You may want to enforce password policies here
  avatarUrl: z.string().optional(),
  bio: z.string().optional(),
  createdAt: z.date().optional(), // Defaults to current time when creating new records
  isEmailVerified: z.boolean().default(false),
  height: z.number().optional(),
  weight: z.number().optional(),
  age: z.number().int().optional(),
  CommunityUser: z.object({
    create: z.array(z.any()).optional(),
    connect: z.array(z.object({ id: z.string().uuid() })).optional()
  }).optional(), // Adjust this to match your actual schema for CommunityUser
  Token: z.object({
    create: z.array(z.any()).optional(),
    connect: z.array(z.object({ id: z.string().uuid() })).optional()
  }).optional() // Adjust this to match your actual schema for Token
});

export default UserSchema;

type User = z.infer<typeof UserSchema>;
