import express from 'express';
import { handleAddToCart,handleProdRemove, handleUpdateQuantity, handleGetCartItems } from '../controllers/cart.js';
import { validateBody } from '../middlewares/validate.js';
import { updateCartQuantitySchema } from '../schema/cart.schema.js';

const router = express.Router();

router.post('/:id', handleAddToCart);
router.get('/', handleGetCartItems);
router.delete('/:id', handleProdRemove);
router.put('/:id',validateBody(updateCartQuantitySchema), handleUpdateQuantity);

export default router;