import Product from '../models/product.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotFoundError, createValidationError } from '../utils/ErrorFactory.js';
import { getCache, setCache } from '../services/cache.js';
import Review from '../models/review.js';
import mongoose from 'mongoose';

const CACHE_TTL = 300;
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Single aggregate over Review collection -> { _id: productId, averageRating, reviewCount },
// merged onto each product. Requires plain objects (.lean() or aggregate output).
const attachRatings = async (plainProducts) => {
    if (!Array.isArray(plainProducts) || plainProducts.length === 0) {
        return [];
    }
    const stats = await Review.aggregate([
        { $group: { _id: '$product', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
    ]);
    const statMap = new Map(stats.map((stat) => [stat._id.toString(), stat]));
    return plainProducts.map((product) => {
        const stat = statMap.get(product._id.toString());
        return {
            ...product,
            averageRating: stat ? Math.round(stat.averageRating * 10) / 10 : 0,
            reviewCount: stat?.reviewCount ?? 0,
        };
    });
};

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
    const products = await attachRatings((await Product.find().lean()));
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
    if (!ProdId || !mongoose.isValidObjectId(ProdId)) {
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
    const product = await Product.findById(ProdId)
        .populate('seller','name shopName');
    if (!product) {
        return next(createNotFoundError('Product'));
    }

    const reviews = await Review.find({ product: product._id })
        .populate('user', 'name')
        .sort({ createdAt: -1 });

    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
        : 0;

    // Plain object only - Redis stores JSON.stringify output
    const productWithReviews = {
        ...product.toObject(),
        reviews,
        averageRating,
        reviewCount
    };

    await setCache(cacheKey, productWithReviews, CACHE_TTL);

    return res.status(200).json({
        success: true,
        message: 'Product retrieved successfully',
        product: productWithReviews
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

    const filteredData = await attachRatings(await Product.find({ category: normalizedCategory }).lean());
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
    const { q, category, minPrice, maxPrice, inStock, sort } = req.validateQuery; // Everything from req.query is a string (or undefined)

    const page = Math.max(parseInt(req.validateQuery.page, 10) || 1, 1); // parseInt = reads digits until it hits garbage, ignores rest. 10 is the radix (base 10), always pass it or you can get weird results with strings like "08"
    const limit = Math.min(Math.max(parseInt(req.validateQuery.limit, 10) || 12, 1), 50);

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
    const products = await attachRatings(results[0]?.data ?? []);

    return res.status(200).json({
        success: true,
        message: q && q.trim() ? `Search results for "${q.trim()}"` : 'Products retrieved successfully',
        products,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    });
});

export { handleGetAllProd, handleGetProdById, handleGetFilteredByCategoryData, handleSearchProducts };
