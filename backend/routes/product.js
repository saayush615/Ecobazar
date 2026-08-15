import express from 'express';
import { handleGetAllProd, handleGetProdById, handleGetFilteredByCategoryData, handleSearchProducts } from '../controllers/product.js';
import { validateQuery } from '../middlewares/validate.js';

const router = express.Router();

router.get('/all', handleGetAllProd);
router.get('/search', validateQuery(searchProductQuerySchema), handleSearchProducts);
router.get('/:id', handleGetProdById);
router.get('/filter/:category', handleGetFilteredByCategoryData);

export default router;