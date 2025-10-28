import product from '../models/product.js';
import cart from '../models/cart.js';
import Order from '../models/order.js';

async function handlePostProd(req,res) {
    const { name, price, category, stock } = req.body;
    const seller = req.user.id;
    const newProduct = await product.create({ name, price, category, stock, seller });
    return res.redirect('/adminPage');
};

async function handleUpdateProd(req,res) {
    const { name, price, category, stock } = req.body;
    const ProductId = req.params.id;
    const Prod = await product.findByIdAndUpdate(ProductId, { name, price, category, stock } );
    return res.redirect('/adminPage');
};

async function handleDeleteProd(req,res) {
    const ProductId = req.params.id;
    const Prod = await product.findByIdAndDelete(ProductId);
    return res.redirect('/adminPage');
};

async function handleShowAllProd(req,res) {
    
};

async function handleUpdateStatus(req, res) {
    try {
        const { status } = req.body;
        const orderId = req.params.id;
        
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const order = await Order.findByIdAndUpdate(
            orderId, 
            { status }, 
            { new: true } // Returns the updated document
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.redirect('/adminPage/orders');
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ error: 'Error updating order status' });
    }
}

export { handlePostProd, handleUpdateProd, handleDeleteProd, handleShowAllProd, handleUpdateStatus };