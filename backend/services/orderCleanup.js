import cron from 'node-cron';
import Order from '../models/order.js';
import redis from '../config/redis.js';
import { increaseStock } from './stock.js';

const GRACE_MINUTES = Number(process.env.ORDER_CLEANUP_GRACE_MINUTES) || 15;

export async function runOrderCleanup() {
    // Distributed lock: only ONE instance may run the job (safe when scaled)
    const lockAcquired = await redis
        .set('lock:order-cleanup', '1', 'EX', 60, 'NX')
        .catch((err) => {
            console.error('Redis lock failed:', err.message);
            return null;
        });
    if (lockAcquired !== 'OK') return; // another instance is already running it

    try {
        const cutoff = new Date(Date.now() - GRACE_MINUTES * 60 * 1000);

        const staleOrders = await Order.find({
            paymentMethod: 'razorpay',
            paymentStatus: 'pending',
            status: 'Pending',
            createdAt: { $lt: cutoff }
        });

        // Group by checkoutSessionId (one checkout = multiple seller orders)[...Set { 'ABC', 'XYZ' }] = ['ABC','XYZ']
        const sessions = [...new Set(staleOrders.map((o) => o.checkoutSessionId))];

        for (const sessionId of sessions) {
            const sessionOrders = staleOrders.filter((o) => o.checkoutSessionId === sessionId);

            // 1. Give the stock back
            for (const order of sessionOrders) {
                for (const item of order.carts) {
                    await increaseStock(item.product, item.quantity);
                }
            }

            // 2. Cancel them (status filter prevents double-processing next run)
            await Order.updateMany(
                { checkoutSessionId: sessionId, paymentStatus: 'pending', status: 'Pending' },
                { paymentStatus: 'failed', status: 'Cancelled' }
            );

            console.log(`Cleanup: cancelled abandoned checkout ${sessionId}`);
        }
    } catch (err) {
        console.error('Order cleanup job failed:', err.message);
    } finally {
        await redis.del('lock:order-cleanup').catch(() => {});
    }
}

export function startOrderCleanup() {
    cron.schedule('*/1 * * * *', runOrderCleanup); // every 15 minutes
    console.log(`Order cleanup job scheduled (every 15 min, grace ${GRACE_MINUTES} min)`);
}