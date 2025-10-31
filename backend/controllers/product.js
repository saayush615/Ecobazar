import Product from '../models/product.js';

async function handleGetProdByName(req,res,next) {
    try{
        const searchQuery = req.body.search;
        const products = await Product.find({name: { $regex: searchQuery, $options: 'i' }});
        // return res.render('home', { user: req.user, products });
        return res.status(200).json({
            success: true,
            message: 'Get product by name',
            user: req.user,
            products
        })
    } catch (err) {
        console.log(`Error in getting product by Name: ${err}`);
        next(err);
    }
}

export { handleGetProdByName };