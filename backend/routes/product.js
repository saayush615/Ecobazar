import express from 'express';
import { handleGetProdByName, handleGetAllProd } from '../controllers/product.js';

const router = express.Router();

router.get('/getAllProd', handleGetAllProd)
router.post('/', handleGetProdByName);
// 🔴 seach by categories is left
// router.get('/category/:category', handleGetProdById);

export default router;