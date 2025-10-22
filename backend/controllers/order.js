const Order = require('../models/order');
const Cart = require('../models/cart');
const user = require('../models/user');

async function handleBuyNow(req, res) {
    try{
        const userId = req.user.id;

        const findCart = await Cart.find({ user: userId});

        const newCart = findCart.map((x) => { 
            return {
                product: x.product, 
                quantity: x.quantity
            }; 
        });

        const stackInOrder = await Order.create({ user: userId, carts: newCart});
        // Delete all items in the cart after creating the order
        await Cart.deleteMany({ user: userId });
        res.redirect('/mycart')

    } catch(err) {
        return res.end('Something went wrong while buying try again')
    }
}

module.exports = { handleBuyNow }