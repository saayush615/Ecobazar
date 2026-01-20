import express from 'express';
import { handleCreateOrder, handleVerifyPayment, handlePaymentFailure, handleCODOrder, handleGetMyOrders, handleCancelOrder } from '../controllers/order.js';

const router = express.Router();

router.post('/create-order', handleCreateOrder);
router.post('/verify-payment', handleVerifyPayment);
router.post('/payment-failure', handlePaymentFailure);

router.post('/cod-order', handleCODOrder);

router.get('/my-orders', handleGetMyOrders);
router.put('/cancel/:id', handleCancelOrder);

export default router;