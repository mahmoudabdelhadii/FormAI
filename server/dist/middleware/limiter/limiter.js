"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentLimiter = exports.signUpSignInLimiter = exports.followLimiter = exports.likeSaveLimiter = exports.createPostLimiter = exports.logLimiter = exports.configLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const MESSAGE = "Too many requests, please try again later.";
const createLimiter = (windowMs, max, message) => {
    return (0, express_rate_limit_1.rateLimit)({
        windowMs,
        max,
        message: { message: message },
    });
};
const configLimiter = createLimiter(60 * 60 * 1000, 3500, MESSAGE);
exports.configLimiter = configLimiter;
const logLimiter = createLimiter(60 * 60 * 1000, 3500, MESSAGE);
exports.logLimiter = logLimiter;
const createPostLimiter = createLimiter(5 * 60 * 1000, 20, MESSAGE);
exports.createPostLimiter = createPostLimiter;
const likeSaveLimiter = createLimiter(10 * 60 * 1000, 250, MESSAGE);
exports.likeSaveLimiter = likeSaveLimiter;
const followLimiter = createLimiter(10 * 60 * 1000, 100, MESSAGE);
exports.followLimiter = followLimiter;
const signUpSignInLimiter = createLimiter(10 * 60 * 1000, 100, MESSAGE);
exports.signUpSignInLimiter = signUpSignInLimiter;
const commentLimiter = createLimiter(5 * 60 * 1000, 100, MESSAGE);
exports.commentLimiter = commentLimiter;
//# sourceMappingURL=limiter.js.map