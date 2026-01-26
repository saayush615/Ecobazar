import express from 'express';
import { handleGetAllProd, handleGetProdById } from '../controllers/product.js';

const router = express.Router();

router.get('/all', handleGetAllProd);
router.get('/:id', handleGetProdById);

export default router;