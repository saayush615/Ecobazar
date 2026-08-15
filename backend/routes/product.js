import express from 'express';
import { handleGetAllProd, handleGetProdById, handleGetFilteredByCategoryData, handleSearchProducts } from '../controllers/product.js';

const router = express.Router();

router.get('/all', handleGetAllProd);
router.get('/search', handleSearchProducts);
router.get('/:id', handleGetProdById);
router.get('/filter/:category', handleGetFilteredByCategoryData);

export default router;