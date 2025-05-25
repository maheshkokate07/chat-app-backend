import rateLimit from "express-rate-limit";

// API rate limiter
export const apiRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 999,
    message: {message: "Too many requests from this IP, please try again later."},
    headers: true
});