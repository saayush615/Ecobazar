import express from 'express';
import { handleAddToCart,handleProdRemove, handleUpdateQuantity, handleGetCartItems } from '../controllers/cart.js';

const router = express.Router();

router.post('/:id', handleAddToCart);
router.get('/', handleGetCartItems);
router.delete('/:id', handleProdRemove);
router.put('/:id', handleUpdateQuantity);

export default router;