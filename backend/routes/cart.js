import express from 'express';
import { handleAddToCart,handleProdRemove } from '../controllers/cart.js';

const router = express.Router();

router.post('/remove/:id', handleProdRemove);
router.post('/:id', handleAddToCart);

export default router;