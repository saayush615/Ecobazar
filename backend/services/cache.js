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
        const keys = [];
        for await (const key of redis.scanIterator({ match: pattern, count: 100 })) { // KEYS blocks Redis by scanning the entire keyspace at once, which can hurt performance on large datasets. SCAN is incremental and non-blocking. The Node Redis client's scanIterator() wraps SCAN in an async iterator
            // so I can use for await...of to process matching keys one at a time without managing the scan cursor manually
            keys.push(key);
        }
        if (keys.length > 0) await redis.del(keys);
    } catch (err) {
        console.error('Redis pattern delete failed:', err.message);
    }
}