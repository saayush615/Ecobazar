import express from 'express';
import { handlePostProd, handleUpdateProd, handleDeleteProd, handleShowAllProd, handleUpdateStatus } from '../controllers/seller.js';
import {upload } from '../config/upload.js'

const router = express.Router();

router.get('/getProduct', handleShowAllProd);
router.post('/product', upload.single('image'), handlePostProd);
router.put('/edit/:id', upload.single('image'), handleUpdateProd);
router.delete('/remove/:id', handleDeleteProd);
router.put('/status/:id', handleUpdateStatus);

export default router;