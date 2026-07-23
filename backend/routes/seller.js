import express from 'express';

import { 
    handlePostProd, 
    handleUpdateProd, 
    handleDeleteProd, 
    handleShowAllProd, 
    handleGetSellerOrders,
    handleGetSellerOrderHistory,
    handleChangeOrderStatus  } from '../controllers/seller.js';

import {upload } from '../config/upload.js'
import { validateBody } from '../middlewares/validate.js';
import { sellerProductSchema, orderStatusSchema } from "../schema/seller.schema.js"

const router = express.Router();

router.get('/', handleShowAllProd);
router.post('/',upload.single('image'), validateBody(sellerProductSchema), handlePostProd);
router.put('/:id',upload.single('image'), validateBody(sellerProductSchema), handleUpdateProd);
router.delete('/:id', handleDeleteProd);

router.get('/orders', handleGetSellerOrders);
router.get('/order-history', handleGetSellerOrderHistory);

router.patch('/orderStatus/:orderId', validateBody(orderStatusSchema), handleChangeOrderStatus);

export default router;