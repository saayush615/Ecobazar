import express from 'express';
import { handleGetAllProd, handleGetProdById, handleGetFilteredByCategoryData } from '../controllers/product.js';

const router = express.Router();

router.get('/all', handleGetAllProd);
router.get('/:id', handleGetProdById);
router.get('/filter/:category', handleGetFilteredByCategoryData);

export default router;