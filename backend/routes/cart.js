const express = require('express');
const router = express.Router();

const { handleAddToCart,handleProdRemove } = require('../controllers/cart');

router.post('/remove/:id', handleProdRemove);
router.post('/:id', handleAddToCart);

module.exports = router;