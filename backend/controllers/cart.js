import Cart from '../models/cart.js';
import Product from '../models/product.js';
import User from '../models/user.js';

async function handleAddToCart(req,res,next) {
    try {
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

        await cartItem.populate('product');

        return res.status(201).json({
            success: true,
            message: 'Product added to cart',
            cartItem
        })
    } catch (error) {
        next(error);
    }
}

async function handleProdRemove(req,res,next) {
    try {
        const userId = req.user.id;
        const cartId = req.params.id;
        const cartItem = await Cart.findOne({ user: userId, _id: cartId });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            })
        }

        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            await cartItem.save();
        } else {
            await Cart.findByIdAndDelete(cartItem._id);
        }
        
        return res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            cartItem
        })
    } catch (error) {
        next(error)
    }
}

async function handleGetCartItems(req,res,next) {
    try {
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
    } catch (error) {
        next(error);
    }
}

export { handleAddToCart, handleProdRemove, handleGetCartItems };