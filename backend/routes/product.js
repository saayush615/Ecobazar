const express = require('express');
const { handleGetProdByName } = require('../controllers/product');
const router = express.Router();

router.post('/', handleGetProdByName);
// 🔴 seach by categories is left
// router.get('/category/:category', handleGetProdById);

module.exports = router;