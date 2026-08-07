import Product from '../models/product.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotFoundError, createValidationError } from '../utils/ErrorFactory.js';
import { getCache, setCache } from '../services/cache.js';

const CACHE_TTL = 300;

const handleGetAllProd = asyncHandler(async (_req,res,next) => {
    const cacheKey = 'products:all';
    const cached = await getCache(cacheKey);
    if(cached) {
        return res.status(200).json({
            success: true,
            message: 'Product reterived successfully',
            products: cached
        })
    }
    const products = await Product.find();
    await setCache(cacheKey, products, CACHE_TTL);

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

    const cacheKey = `product:${ProdId}`;
    const cached = await getCache(cacheKey);
    if(cached) {
        return res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            product: cached
        })
    }
    const product = await Product.findById(ProdId);
    if (!product) {
        return next(createNotFoundError('Product'));
    }

    await setCache(cacheKey, product, CACHE_TTL);

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

    const cacheKey = `products:category:${normalizedCategory}`;
    const cached = await getCache(cacheKey);
    if(cached){
        return res.status(200).json({
            success: true,
            message: 'Product get successfully',
            products: cached
        })
    }

    const filteredData = await Product.find({ category: normalizedCategory});
    await setCache(cacheKey, filteredData, CACHE_TTL);

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
