import express from 'express';
import { handlePostProd, handleUpdateProd, handleDeleteProd, handleShowAllProd, handleUpdateStatus } from '../controllers/admin.js';

const router = express.Router();

router.post('/product', handlePostProd);
router.put('/edit/:id', handleUpdateProd);
router.delete('/remove/:id', handleDeleteProd);
router.get('/orders', handleShowAllProd);
router.put('/status/:id', handleUpdateStatus);

export default router;