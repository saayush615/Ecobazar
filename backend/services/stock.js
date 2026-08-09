import redis from '../config/redis.js';
import Product from '../models/product.js';
import { deleteCache, deleteCacheByPattern } from './cache.js';

const STOCK_TTL = 300;

export async function getAvailableStock(productId) {
    // Try to get stock from Redis
    try {
        const cached = await redis.get(`stock:${productId}`);
        if (cached !== null) return Number(cached);
    } catch (err) {
        console.error('Redis stock get failed:', err.message);
    }

    // If Redis doesn't work, get stock from MongoDB
    const product = await Product.findById(productId).select('stock');
    const stock = product?.stock ?? 0;

    // Try to save it in Redis for next time
    try {
        await redis.set(`stock:${productId}`, stock, 'EX', STOCK_TTL);
    } catch (err) {
        console.error('Redis stock set failed:', err.message);
    }

    return stock;
}

export async function decreaseStock(productId, quantity) {
    // Authoritative: atomic check-and-decrement. Returns null if not enough stock.
    const result = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
    );

    if (!result) return false;

    // Keep the Redis counter in sync (best-effort; never blocks success)
    await redis.decrby(`stock:${productId}`, quantity)
        .catch(err => console.error('Redis stock decrby failed:', err.message));

    // Buyers must see the new stock immediately
    await deleteCacheByPattern('products:*');
    await deleteCache(`product:${productId}`);

    return true;
}

export async function increaseStock(productId, quantity) {
    const result = await Product.findOneAndUpdate(
        { _id: productId },
        { $inc: { stock: quantity } },
        { new: true }
    );

    await redis.incrby(`stock:${productId}`, quantity)
        .catch(err => console.error('Redis stock incrby failed:', err.message));

    await deleteCacheByPattern('products:*');
    await deleteCache(`product:${productId}`);

    return result;
}

// takes a list of reserved products and restores each product's stock by calling
export async function releaseReservedStock(reservedItems) {
    for (const item of reservedItems) {
        await increaseStock(item.productId, item.quantity);
    }
}

export async function invalidateStock(productId) {
    await redis.del(`stock:${productId}`)
        .catch(err => console.error('Redis stock del failed:', err.message));
}