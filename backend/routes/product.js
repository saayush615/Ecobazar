import express from 'express';
import { handleGetAllProd, handleGetProdByName } from '../controllers/product.js';

const router = express.Router();

router.get('/all', handleGetAllProd)
router.post('/', handleGetProdByName);
// 🔴 seach by categories is left
// router.get('/category/:category', handleGetProdById);

export default router;