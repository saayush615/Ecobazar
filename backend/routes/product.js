import express from 'express';
import { handleGetProdByName } from '../controllers/product.js';

const router = express.Router();

router.post('/', handleGetProdByName);
// 🔴 seach by categories is left
// router.get('/category/:category', handleGetProdById);

export default router;