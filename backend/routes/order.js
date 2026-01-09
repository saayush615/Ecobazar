import express from 'express';
import { handleCreateOrder, handleVerifyPayment, handlePaymentFailure, handleCODOrder } from '../controllers/order.js';

const router = express.Router();

router.post('/create-order', handleCreateOrder);
router.post('/verify-payment', handleVerifyPayment);
router.post('/payment-failure', handlePaymentFailure);

router.post('/cod-order', handleCODOrder);

export default router;