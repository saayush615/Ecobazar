import Cart from '../models/cart.js';
import Product from '../models/product.js';
import User from '../models/user.js';

async function handleAddToCart(req,res) {
    if (!req.user) {
            return res.redirect('/login');
        }
    const userId = req.user.id;

    const productId = req.params.id;

    let cartItem = await Cart.findOne({ user: userId, product: productId });

    if (cartItem) {
        // If the product exists, increment the quantity
        cartItem.quantity += 1;
        await cartItem.save();
    } else {
        // If the product does not exist, add it to the cart with quantity 1
        cartItem = new Cart({
            user: userId,
            product: productId,
            quantity: 1
        });
        await cartItem.save();
    }

    // return res.redirect('/'); // Redirect to the home page after adding to cart
    return res.status(201).json({
        success: true,
        message: 'Product added to cart'
    })
}

async function handleProdRemove(req,res) {
    const userId = req.user.id;
    const cartId = req.params.id;
    const cartItem = await Cart.findOne({ user: userId, _id: cartId });

    // console.log(cartItem)// debugging

    if (cartItem) {
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            await cartItem.save();
        } else {
            await Cart.findByIdAndDelete(cartItem._id);
        }
    }
    // return res.redirect('/mycart');
    return res.status(200).json({
        success: false,
        message: 'Item removed from cart',
        cartItem
    })
}

export { handleAddToCart, handleProdRemove };