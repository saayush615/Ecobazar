import express from 'express';
import { handleAddToCart,handleProdRemove, handleGetCartItems } from '../controllers/cart.js';

const router = express.Router();

router.post('/remove/:id', handleProdRemove);
router.post('/:id', handleAddToCart);
router.get('/', handleGetCartItems)

export default router;