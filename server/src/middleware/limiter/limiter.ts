import {rateLimit } from 'express-rate-limit'
const MESSAGE = "Too many requests, please try again later.";

/**
 * Creates an express rate limiter middleware.
 *
 * @param windowMs {number} The time window in milliseconds during which
 * the rate limit is enforced.
 * @param max {number} The maximum number of requests allowed during the
 * specified time window.
 * @param message {string} The error message to be returned when the rate
 * limit is exceeded.
 *
 * @returns {Function} An express middleware that enforces the specified
 * rate limit.
 */
const createLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    /**
     * The time window in milliseconds during which the rate limit is
     * enforced.
     */
    windowMs,
    /**
     * The maximum number of requests allowed during the specified
     * time window.
     */
    max,
    /**
     * The error message to be returned when the rate limit is exceeded.
     */
    message: { message },
  });
};

const configLimiter = createLimiter(60 * 60 * 1000, 3500, MESSAGE);
const logLimiter = createLimiter(60 * 60 * 1000, 3500, MESSAGE);
const createPostLimiter = createLimiter(5 * 60 * 1000, 20, MESSAGE);
const likeSaveLimiter = createLimiter(10 * 60 * 1000, 250, MESSAGE);
const followLimiter = createLimiter(10 * 60 * 1000, 100, MESSAGE);
const signUpSignInLimiter = createLimiter(10 * 60 * 1000, 100, MESSAGE);
const commentLimiter = createLimiter(5 * 60 * 1000, 100, MESSAGE);

export  {
  configLimiter,
  logLimiter,
  createPostLimiter,
  likeSaveLimiter,
  followLimiter,
  signUpSignInLimiter,
  commentLimiter,
}