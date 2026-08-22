import express from 'express';
import { handleGetAllProd, handleGetProdById, handleGetFilteredByCategoryData, handleSearchProducts, handleSuggestProducts } from '../controllers/product.js';
import { validateQuery } from '../middlewares/validate.js';
import { searchProductQuerySchema, suggestProductQuerySchema } from '../schema/product.schema.js';

const router = express.Router();

router.get('/all', handleGetAllProd);
router.get('/search', validateQuery(searchProductQuerySchema), handleSearchProducts);
router.get('/suggest', validateQuery(suggestProductQuerySchema), handleSuggestProducts);
router.get('/:id', handleGetProdById);
router.get('/filter/:category', handleGetFilteredByCategoryData);

export default router;