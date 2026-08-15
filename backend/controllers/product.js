import Product from '../models/product.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotFoundError, createValidationError } from '../utils/ErrorFactory.js';
import { getCache, setCache } from '../services/cache.js';

const CACHE_TTL = 300;
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

const handleSearchProducts = asyncHandler(async (req, res, next) => {
    const { q, category, minPrice, maxPrice, inStock, sort } = req.query; // Everything from req.query is a string (or undefined)

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1); // parseInt = reads digits until it hits garbage, ignores rest. 10 is the radix (base 10), always pass it or you can get weird results with strings like "08"
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);

    if (
        (minPrice !== undefined && minPrice !== '' && isNaN(Number(minPrice))) ||
        (maxPrice !== undefined && maxPrice !== '' && isNaN(Number(maxPrice)))
    ) {
        return next(createValidationError('minPrice and maxPrice must be numbers'));
    }

    // Match
    const match = {};

    if (q && q.trim()) {
        match.name = { $regex: escapeRegex(q.trim()), $options: 'i' }; // $options: 'i' = case-insensitive.
    }
    if (category && category.trim()) {
        match.category = { $regex: escapeRegex(category.trim()), $options: 'i' };
    }
    if (inStock === 'true') {
        match.stock = { $gt: 0 };
    }

    const pipeline = [
        { $match: match },
        { $addFields: { effectivePrice: { $ifNull: ['$discountPrice', '$originalPrice'] } } },
    ];

    // Pipeline push
    const priceRange = {};
    if (minPrice !== undefined && minPrice !== '') priceRange.$gte = Number(minPrice);
    if (maxPrice !== undefined && maxPrice !== '') priceRange.$lte = Number(maxPrice);
    if (Object.keys(priceRange).length > 0) {
        pipeline.push({ $match: { effectivePrice: priceRange } });
    }

    const sortMap = {
        price_asc: { effectivePrice: 1 },
        price_desc: { effectivePrice: -1 },
        newest: { createdAt: -1 },
    };
    if (sort && sortMap[sort]) {
        pipeline.push({ $sort: sortMap[sort] });
    }

    pipeline.push({
        $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
    });

    const results = await Product.aggregate(pipeline);
    const total = results[0]?.metadata[0]?.total ?? 0;

    return res.status(200).json({
        success: true,
        message: q && q.trim() ? `Search results for "${q.trim()}"` : 'Products retrieved successfully',
        products: results[0]?.data ?? [],
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    });
});

export { handleGetAllProd, handleGetProdById, handleGetFilteredByCategoryData, handleSearchProducts };
