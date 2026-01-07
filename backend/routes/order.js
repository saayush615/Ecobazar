import express from 'express';
import { handleCreateOrder, handleVerifyPayment, handlePaymentFailure } from '../controllers/order.js';

const router = express.Router();

router.post('/create-order', handleCreateOrder);
router.post('/verify-payment', handleVerifyPayment);
router.post('/payment-failure', handlePaymentFailure);

export default router;