import express from 'express';
import { handleAddToCart,handleProdRemove, handleGetCartItems } from '../controllers/cart.js';

const router = express.Router();

router.post('/:id', handleAddToCart);
router.get('/', handleGetCartItems);
router.delete('/remove/:id', handleProdRemove);

export default router;