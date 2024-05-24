import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { PostSchema } from '../../models/post.model';
import {UserSchema, emailSchema, passwordSchema, usernameSchema, firstNameSchema, lastNameSchema} from '../../models/user.model';
import CommentSchema from '../../models/comment.model';
import { ZodSchema, ZodError } from 'zod';
// Middleware for validating the request body against the schema
const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (e) {
    if (e instanceof ZodError) {
      const errorDetails = e.errors.map((error) => ({
        message: error.message,
        path: error.path.join('.'),
        code: error.code,
      }));

      console.log(JSON.stringify(errorDetails, null, 2)); // Print detailed error information for debugging

      res.status(400).json({ errors: errorDetails });
    } else {
      console.error("Unexpected error:", e); // Handle unexpected errors
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
  
  // Export the middleware functions
  export const postValidator = validate(PostSchema);
  export const userValidator = validate(UserSchema);
  export const commentValidator = validate(CommentSchema);