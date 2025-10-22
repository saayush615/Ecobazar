const express = require('express');
const router = express.Router();
const { handleBuyNow } = require('../controllers/order');

router.post('/BuyNow', handleBuyNow);

module.exports = router;