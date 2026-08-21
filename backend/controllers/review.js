import review from "../models/review.js";
import Product from '../models/product.js'
import asyncHandler from "../utils/asyncHandler.js";
import { createDuplicateError, createForbiddenError, createNotFoundError, createValidationError } from "../utils/ErrorFactory.js";
import mongoose from 'mongoose';
// import { deleteCache } from '../services/cache.js';


const handleGetReview = asyncHandler(async (req,res,next) => {
    const { productId } = req.params;

    if(!productId){
        return next(createValidationError('ProductId is required'));
    }

    const reviews = await review
            .find({ product: productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 })

    return res.status(200).json({
        success: true,
        message: reviews.length > 0 ? 'Reviews retrieved successfully' : 'There are no reviews yet',
        count: reviews.length,
        reviews
    })
})

const handlePostReview = asyncHandler(async (req,res,next) => {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const userId = req.user.id;

    if(!productId || !mongoose.isValidObjectId(productId)){
        return next(createValidationError('A valid productId is required'));
    }

    const productExists = await Product.findById(productId);
    if(!productExists) {
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
        comment: comment.trim() ?? ''
    })

    // await deleteCache(`product:${productId}`);

    return res.status(201).json({
        success: true,
        message: 'Review posted succcessfully',
        rating: result.rating,
        comment: result.comment
    })
})

const handleDeleteReview = asyncHandler(async (req,res,next) => {
    const { reviewId } = req.params;
    const userId = req.user.id;

    if(!reviewId){
        return next(createValidationError('review is required field!'));
    }

    const existingReview = await review.findById(reviewId);
    if (!existingReview) {
        return next(createNotFoundError('Review'));
    }

    if(existingReview.user.toString() !== userId.toString()){
        return next(createForbiddenError());
    }

    await review.deleteOne({_id: reviewId});

    // await deleteCache(`product:${existingReview.product}`);

    return res.status(200).json({
        success: true,
        message: 'Review deleted succcessfully!'
    })
})

export {handleGetReview, handlePostReview, handleDeleteReview}