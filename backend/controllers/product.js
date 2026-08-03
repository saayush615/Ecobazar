import Product from '../models/product.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotFoundError, createValidationError } from '../utils/ErrorFactory.js';

const handleGetAllProd = asyncHandler(async (_req,res,next) => {
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
})

const handleGetProdById = asyncHandler(async (req,res,next) => {
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
})

const handleGetFilteredByCategoryData = asyncHandler(async (req,res,next) => {
    const category = req.params.category;
    if (!category) {
        return next(createValidationError('category is required'));
    };

    const normalizedCategory = category.replace(/-and-/g, ' & ')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());

    const filteredData = await Product.find({ category: normalizedCategory});
    if (filteredData.length === 0) {
        return res.status(200).json({
            success: true,
            message: 'No Product of this category',
            products: []
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Product get successfully',
        products: filteredData
    })
})

export { handleGetAllProd, handleGetProdById, handleGetFilteredByCategoryData };
