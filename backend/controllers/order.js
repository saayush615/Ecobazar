import Order from '../models/order.js';
import Cart from '../models/cart.js';
import user from '../models/user.js';

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
        // res.redirect('/mycart')
        return res.status(201).json({
            success: true,
            message: 'Order Placed Successfully!'
        })

    } catch(err) {
        return res.end('Something went wrong while buying try again')
    }
}

export { handleBuyNow };