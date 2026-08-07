import Cart from '../models/cart.js';
import Product from '../models/product.js';
import User from '../models/user.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getAvailableStock } from '../services/stock.js';

const handleAddToCart = asyncHandler(async (req,res,next) => {
    const userId = req.user.id;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }

    let cartItem = await Cart.findOne({ user: userId, product: productId });
    if (cartItem) {

        cartItem.quantity += 1;
        await cartItem.save();
    } else {
        cartItem = new Cart({
            user: userId,
            product: productId,
            quantity: 1
        });
        await cartItem.save();
    }

    const cartItems = await Cart.find({ user: userId }).populate('product').sort({ createdAt: -1 });

    const total = cartItems.reduce((sum, item) => {
        return sum + (item.quantity * (item.product?.discountPrice || item.product?.originalPrice))
    }, 0)

    return res.status(201).json({
        success: true,
        message: 'Product added to cart',
        cartItems,
        total,
        itemCount: cartItems.length
    })
})

const handleProdRemove = asyncHandler(async (req,res,next) => {
    const userId = req.user.id;
    const cartId = req.params.id;
    const cartItem = await Cart.findOne({ user: userId, _id: cartId }).populate('product');

    if (!cartItem) {
        return res.status(404).json({
            success: false,
            message: 'Cart item not found'
        })
    }

    await Cart.findByIdAndDelete(cartItem._id);

    const cartItems = await Cart.find({ user: userId }).populate('product').sort({ createdAt: -1 });

    const total = cartItems.reduce((sum, item) => {
        return sum + (item.quantity * (item.product?.discountPrice || item.product?.originalPrice))
    }, 0)

    return res.status(200).json({
        success: true,
        message: 'Item removed from cart',
        cartItems,
        total,
        itemCount: cartItems.length
    })
})

const handleUpdateQuantity = asyncHandler(async (req,res,next) => {
    const userId = req.user.id;
    const cartId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
        return res.status(400).json({
            success: false,
            message: 'Quantity must be positive'
        })
    }

    const cartItem = await Cart.findOne({ user: userId, _id: cartId });
    if (!cartItem) {
        return res.status(404).json({
            success: false,
            message: 'Cart Item not Found'
        })
    }

    const availableStock = await getAvailableStock(cartItem.product);
    if (quantity > availableStock) {
        return res.status(400).json({
            success: false,
            message: `Only ${availableStock} items are available in stock`
        })
    }

    await Cart.findOneAndUpdate({ _id: cartId }, { quantity: quantity }, {new: true}).populate('product');
    const cartItems = await Cart.find({ user: userId }).populate('product').sort({ createdAt: -1 });

    const total = cartItems.reduce((sum, item) => {
        return sum + (item.quantity * (item.product?.discountPrice || item.product?.originalPrice))
    }, 0)

    return res.status(200).json({
        success: true,
        message: 'Cart quantity updated successfully',
        cartItems,
        total,
        itemCount: cartItems.length
    })
})

const handleGetCartItems = asyncHandler(async (req,res,next) => {
    const userId = req.user.id;
    
    const cartItems = await Cart.find({ user: userId}).populate('product').sort({ createdAt: -1 });

    if (cartItems.length === 0) {
        return res.status(200).json({
            success: true,
            message: 'Empty Cart',
            cartItems: []
        });
    }

    const total = cartItems.reduce((sum,item) => {
        return sum + (item.quantity * (item.product?.discountPrice ? item.product?.discountPrice : item.product?.originalPrice))
    }, 0)

    return res.status(200).json({
        success: true,
        message: 'Cart item retrieved success',
        cartItems,
        total,
        itemCount: cartItems.length
    })
})

export { handleAddToCart, handleProdRemove, handleUpdateQuantity, handleGetCartItems };
