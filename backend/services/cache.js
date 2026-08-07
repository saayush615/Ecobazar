import redis from '../config/redis.js';

export async function getCache(key) {
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error('Redis get failed:', err.message);
        return null; // Redis failing can never crash your app
    }
}

export async function setCache(key, data, ttl=300) {
    try {
        await redis.set(key, JSON.stringify(data), 'EX', ttl);
    } catch (err) {
        console.error('Redis set failed:', err.message);
    }
}

export async function deleteCache(key) {
    try {
        await redis.del(key);
    } catch (err) {
        console.error('Redis del failed:', err.message);
    }
}

export async function deleteCacheByPattern(pattern) {
    try {
        let cursor = '0';
        do {
            const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
            // cursor     -> Where this SCAN starts (Redis's internal scan position).
            // nextCursor -> Where the next SCAN should continue from.
            // keys       -> Matching keys found in this scan batch.
            // COUNT 100  -> Try to return ~100 keys per scan (only a hint).
            if (keys.length > 0) await redis.del(keys);
            cursor = nextCursor;
        } while (cursor !== '0');
    } catch (err) {
        console.error('Redis pattern delete failed:', err.message);
    }
}