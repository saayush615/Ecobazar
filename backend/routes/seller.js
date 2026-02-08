import express from 'express';

import { 
    handlePostProd, 
    handleUpdateProd, 
    handleDeleteProd, 
    handleShowAllProd, 
    handleGetSellerOrders,
    handleGetSellerOrderHistory  } from '../controllers/seller.js';

import {upload } from '../config/upload.js'

const router = express.Router();

router.get('/', handleShowAllProd);
router.post('/', upload.single('image'), handlePostProd);
router.put('/:id', upload.single('image'), handleUpdateProd);
router.delete('/:id', handleDeleteProd);

router.get('/orders', handleGetSellerOrders);
router.get('/order-history', handleGetSellerOrderHistory);

export default router;