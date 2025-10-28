import express from 'express';
import { handleBuyNow } from '../controllers/order.js';

const router = express.Router();

router.post('/BuyNow', handleBuyNow);

export default router;