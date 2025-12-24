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
        next(err);
    }
}

async function handleGetAllProd(_req,res,next) {
    try {
        const products = await Product.find();
        if (!products) {
            return res.status(204).json({
                success: true,
                message: 'No Product Added'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Product reterived successfully',
            products
        })
    } catch (error) {
        next(error);
    }
}

export { handleGetProdByName, handleGetAllProd };