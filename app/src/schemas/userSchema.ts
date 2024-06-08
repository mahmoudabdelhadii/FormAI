import { z } from 'zod';
const idSchema = z.string().uuid().optional();
const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters long")
  .max(20, "Username must be no more than 20 characters long")
  .refine(value => /^[a-zA-Z0-9]+$/.test(value), {
    message: "Username can only contain alphanumeric characters, period, or underscore",
  });
const firstNameSchema = z.string().trim().min(1, "First name must be at least 1 character long");
const lastNameSchema = z.string().trim().min(1, "Last name must be at least 1 character long");
const emailSchema = z.string().email("Invalid email");
const passwordSchema = z.string().min(8).superRefine((password, ctx) => {
  const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
  const containsLowercase = (ch: string) => /[a-z]/.test(ch);
  const containsSpecialChar = (ch: string) =>
    /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);

  let countOfUpperCase = 0,
    countOfLowerCase = 0,
    countOfNumbers = 0,
    countOfSpecialChar = 0;

  for (let i = 0; i < password.length; i++) {
    const ch = password.charAt(i);
    if (!isNaN(+ch)) countOfNumbers++;
    else if (containsUppercase(ch)) countOfUpperCase++;
    else if (containsLowercase(ch)) countOfLowerCase++;
    else if (containsSpecialChar(ch)) countOfSpecialChar++;
  }

  if (countOfLowerCase < 1) {
    ctx.addIssue({
      code: "custom",
      path: ["password"],
      message: "Password must contain at least one lowercase letter.",
    });
  }
  if (countOfNumbers < 1) {
    ctx.addIssue({
      code: "custom",
      path: ["password"],
      message: "Password must contain at least one number.",
    });
  }
  if (countOfUpperCase < 1) {
    ctx.addIssue({
      code: "custom",
      path: ["password"],
      message: "Password must contain at least one uppercase letter.",
    });
  }
  if (countOfSpecialChar < 1) {
    ctx.addIssue({
      code: "custom",
      path: ["password"],
      message: "Password must contain at least one special character.",
    });
  }
});
const avatarUrlSchema = z.string().optional();
const bioSchema = z.string().max(100, "bio must be no more than 100 characters long").optional();
const createdAtSchema = z.date().optional();
const isEmailVerifiedSchema = z.boolean().default(false);
const heightSchema = z.number().optional();
const weightSchema = z.number().optional();
const ageSchema = z.number().int().optional();
const UserSchema = z.object({
    id: idSchema,
    username: usernameSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    email: emailSchema,
    password: passwordSchema,
    avatarUrl: avatarUrlSchema,
    bio: bioSchema,
    createdAt: createdAtSchema,
    isEmailVerified: isEmailVerifiedSchema,
    height: heightSchema,
    weight: weightSchema,
    age: ageSchema,
  });
export {
    UserSchema,
  usernameSchema,
  firstNameSchema,
  lastNameSchema,
  emailSchema,
  passwordSchema,
  avatarUrlSchema,
  bioSchema,
  createdAtSchema,
  isEmailVerifiedSchema,
  heightSchema,
  weightSchema,
  ageSchema,};

 export type User = z.infer<typeof UserSchema>;