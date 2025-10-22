const Product = require('../models/product');

async function handleGetProdByName(req,res) {
    try{
        const searchQuery = req.body.search;
        const products = await Product.find({name: { $regex: searchQuery, $options: 'i' }});
        return res.render('home', { user: req.user, products });
    } catch (err) {
        res.status(500).json({message: 'Server side error', err});
    }
}


module.exports = { handleGetProdByName };