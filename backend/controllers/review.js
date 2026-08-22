import mongoose from 'mongoose';
import review from '../models/review.js';
import Product from '../models/product.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createValidationError, createNotFoundError, createDuplicateError, createForbiddenError } from '../utils/ErrorFactory.js';
import { deleteCache } from '../services/cache.js';

const handleGetReview = asyncHandler(async (req,res,next) => {
    const { productId } = req.params;

    if (!productId) {
        return next(createValidationError('ProductId is required'));
    }

    const reviews = await review
        .find({ product: productId })
        .populate('user', 'name')
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        message: reviews.length > 0 ? 'Reviews retrieved successfully' : 'There are no reviews yet',
        count: reviews.length,
        reviews
    })
})

const handlePostReview = asyncHandler(async (req,res,next) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!productId || !mongoose.isValidObjectId(productId)) {
        return next(createValidationError('A valid productId is required'));
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
        return next(createNotFoundError('Product'));
    }

    const existingReview = await review.findOne({ product: productId, user: userId });
    if (existingReview) {
        return next(createDuplicateError('You have already reviewed this product'));
    }

    const created = await review.create({
        product: productId,
        user: userId,
        rating,
        comment: comment?.trim() ?? ''
    })

    // product:${id} cache holds reviews/avg-rating -> must be busted.
    // List caches now embed ratings too, so bust them as well.
    await deleteCache(`product:${productId}`);
    await deleteCache('products:all');
    if (productExists.category) {
        await deleteCache(`products:category:${productExists.category}`);
    }

    return res.status(201).json({
        success: true,
        message: 'Review posted successfully',
        review: created
    })
})

const handleDeleteReview = asyncHandler(async (req,res,next) => {
    const { reviewId } = req.params;
    const userId = req.user.id;

    if (!reviewId) {
        return next(createValidationError('reviewId is required'));
    }

    const existingReview = await review.findById(reviewId);
    if (!existingReview) {
        return next(createNotFoundError('Review'));
    }

    // ObjectId -> string compare against JWT payload's id
    if (existingReview.user.toString() !== userId.toString()) {
        return next(createForbiddenError());
    }

    await review.deleteOne({ _id: reviewId });

    const parentProduct = await Product.findById(existingReview.product).select('category');
    await deleteCache(`product:${existingReview.product}`);
    await deleteCache('products:all');
    if (parentProduct?.category) {
        await deleteCache(`products:category:${parentProduct.category}`);
    }

    return res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
    })
})

export { handleGetReview, handlePostReview, handleDeleteReview };