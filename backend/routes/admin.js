const express = require('express');
const router = express.Router();

const { handlePostProd, handleUpdateProd, handleDeleteProd, handleShowAllProd, handleUpdateStatus } = require('../controllers/admin');

router.post('/product', handlePostProd);
router.put('/edit/:id', handleUpdateProd);
router.delete('/remove/:id', handleDeleteProd);
router.get('/orders', handleShowAllProd);
router.put('/status/:id', handleUpdateStatus);

module.exports = router;