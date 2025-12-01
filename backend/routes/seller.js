import express from 'express';
import { handlePostProd, handleUpdateProd, handleDeleteProd, handleShowAllProd, handleUpdateStatus } from '../controllers/seller.js';

const router = express.Router();

router.get('/getProduct', handleShowAllProd);
router.post('/product', handlePostProd);
router.put('/edit/:id', handleUpdateProd);
router.delete('/remove/:id', handleDeleteProd);
router.put('/status/:id', handleUpdateStatus);

export default router;