import Product from '../models/product.js';
import { createNotFoundError, createValidationError } from '../utils/ErrorFactory.js';

async function handleGetAllProd(_req,res,next) {
    try {
        const products = await Product.find();
        if (products.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No Product Added',
                products: []
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

async function handleGetProdById(req,res,next) {
    try {
        const ProdId = req.params.id;
        if (!ProdId) {
            return next(createValidationError('ProductId is required'));
        }

        const product = await Product.findById(ProdId);
        if (!product) {
            return next(createNotFoundError('Product'));
        }

        return res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            product
        })
    } catch (error) {
        next(error)
    }
}


export { handleGetAllProd, handleGetProdById };