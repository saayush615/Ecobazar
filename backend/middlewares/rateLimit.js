import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis from '../config/redis.js';

const sendCommand = (...args) => redis.call(...args);

// rate-limit-redis loads its Lua script during store init (a network call).
// With `enableOfflineQueue: false`, ioredis rejects commands before the
// socket is writable, so we must NOT create any store until Redis is ready.
await new Promise((resolve) => {
    if (redis.status === 'ready') return resolve();
    redis.once('ready', resolve);
});

// Don't "fix" this by flipping enableOfflineQueue back to true. That would make a dead Redis hang every command through ioredis's queue and stall requests — the exact failure mode you set that option to avoid. The ready-wait keeps your resilience config intact.

const rateLimitDefaults = (prefix) => ({
    store: new RedisStore({ sendCommand, prefix }),
    standardHeaders: 'draft-8',   // IETF combined RateLimit header
    legacyHeaders: false,          // drop old X-RateLimit-* headers
    passOnStoreError: true,        // fail-open if Redis is down
    handler: (req, res, next, options) =>
        res.status(options.statusCode).json({ success: false, error: options.message }),
});

export const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,     // 1 hour
    limit: 5,                     // 5 signups / hour / IP
    message: 'Too many signup attempts. Try again later.',
    ...rateLimitDefaults('rl:signup:'),
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,     // 15 minutes
    limit: 5,                     // 5 FAILED attempts / 15 min / IP
    skipSuccessfulRequests: true, // successful logins (200) are NOT counted
    message: 'Too many failed login attempts. Try again in 15 minutes.',
    ...rateLimitDefaults('rl:login:'),
});

export const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: 'Too many messages sent. Try again later.',
    ...rateLimitDefaults('rl:contact:'),
});

export const oauthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: 'Too many login attempts. Try again later.',
    ...rateLimitDefaults('rl:oauth:'),
});