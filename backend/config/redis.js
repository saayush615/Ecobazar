import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 1, //  only one retry per command, so a dead Redis can't stall the server
    enableOfflineQueue: false // if Redis is down, commands fail immediately instead of queuing and hanging your requests
});

redis.on('connect', () => console.log('Connected to Redis'));
redis.on('error', (err) => console.error('Redis error:', err.message));

export default redis;