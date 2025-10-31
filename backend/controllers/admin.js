import product from '../models/product.js';
import cart from '../models/cart.js';
import Order from '../models/order.js';
import { createValidationError, createNotFoundError } from '../utils/ErrorFactory.js'

async function handlePostProd(req,res,next) {
    const { name, price, category, stock } = req.body;
    const seller = req.user.id;
    const newProduct = await product.create({ name, price, category, stock, seller });
    // return res.redirect('/adminPage');
    return res.status(201).json({ success: true, message: 'Product created successfully', product: newProduct });
};

async function handleUpdateProd(req,res,next) {
    const { name, price, category, stock } = req.body;
    const ProductId = req.params.id;
    const Prod = await product.findByIdAndUpdate(ProductId, { name, price, category, stock } );
    // return res.redirect('/adminPage');
    return res.status(200).json({ success: true, message: 'Product updated successfully' });
};

async function handleDeleteProd(req,res,next) {
    const ProductId = req.params.id;
    const Prod = await product.findByIdAndDelete(ProductId);
    // return res.redirect('/adminPage');
    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
};

async function handleShowAllProd(req,res,next) {
    
};

async function handleUpdateStatus(req, res,next) {
    try {
        const { status } = req.body;
        const orderId = req.params.id;
        
        if (!status) {
            return next(createValidationError('Status is required'))
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status }, 
            { new: true } // Returns the updated document
        );

        if (!order) {
            return next(createNotFoundError('Order'))
        }

        // res.redirect('/adminPage/orders');
        res.status(200).json({ success: true, message: 'Order status updated successfully', order });
    } catch (err) {
        console.error('Error updating order status:', err);
        next(err);
    }
}

export { handlePostProd, handleUpdateProd, handleDeleteProd, handleShowAllProd, handleUpdateStatus };