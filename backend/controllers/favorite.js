import Favorite from '../models/favorite.js';
import Product from '../models/product.js';
import { createNotFoundError, createValidationError, createDuplicateError } from '../utils/ErrorFactory.js'

async function handlePostFav(req,res,next) {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        if (!productId) {
            return next(createValidationError('Product Id is required'));
        }

        const productExists = await Product.findById(productId);
        if (!productExists) {
            return next(createNotFoundError('Product'));
        }

        const existingFav = await Favorite.findOne({user: userId, product: productId});
        if (existingFav) {
            return next(createDuplicateError('Product already is in wishlist'))
        }

        const favcard = await Favorite.create({ user: userId, product: productId });
        
        const favCards = await Favorite.find({ user: userId }).populate('product').sort({ createdAt: -1 });

        return res.status(201).json({
            success: true,
            message: 'Product added to wishlist',
            count: favCards.length,
            data: favCards
        })
    } catch (error) {
        next(error);
    }
}

async function handleGetFav(req,res,next) {
    try {
        const userId = req.user.id;

        const favCards = await Favorite.find({ user: userId }).populate('product').sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: favCards.length > 0 ? 'Wishlist retrieved successfully' : 'Wishlist is Empty',
            count: favCards.length,
            data: favCards
        })
    } catch (error) {
        next(error);
    }
}

async function handleDeleteFav(req,res,next) {
    try {
        const userId = req.user.id;
        const { favoriteId } = req.params;
        if (!favoriteId) {
            return next(createValidationError('favoriteId not found'));
        }

        const favorite = await Favorite.findOne({ _id: favoriteId, user: userId});
        if (!favorite) {
            return next(createNotFoundError('Favorite item'));
        }

        await Favorite.deleteOne({ _id: favoriteId });

        return res.status(200).json({
            success: true,
            message: 'Item removed from wishlist'
        })
    } catch (error) {
        next(error);
    }
}

export { handlePostFav, handleGetFav, handleDeleteFav }