import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import rateLimit from 'express-rate-limit';

// Basic in-memory rate limiter.
// For production use a distributed store (Redis) to share limits across instances.
const redisClient = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
export const defaultRateLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args: any) => (redisClient as any).call(...args) }),
  windowMs: 60 * 1000, // 1 minute
  max: 120, // limit each IP to 120 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});
