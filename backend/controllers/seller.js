import product from '../models/product.js';
import cart from '../models/cart.js';
import Order from '../models/order.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { createValidationError, createNotFoundError, createForbiddenError, createFileUploadError } from '../utils/ErrorFactory.js'
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function handlePostProd(req, res, next) {
    try {
        const { name, originalPrice, discountPrice, category, stock } = req.body;
        const seller = req.user.id;

        let imageUrl = null;

        if (req.file) {
            const localFilePath = req.file.path;
            imageUrl = await uploadToCloudinary(localFilePath);

            if (!image) {
                return next(createFileUploadError('Failed to upload image to cloudinary'));
            }
        }
        
        // Get image path if uploaded
        const image = req.file ? `/uploads/products/${req.file.filename}` : null;
        
        const newProduct = await product.create({ 
            name, 
            originalPrice,
            discountPrice,
            category, 
            stock, 
            image: imageUrl,
            seller 
        });
        
        return res.status(201).json({ 
            success: true, 
            message: 'Product created successfully', 
            product: newProduct 
        });
    } catch (error) {
        // Delete uploaded file if product creation fails
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        next(error);
    }
}

async function handleUpdateProd(req, res, next) {
    try {
        const { name, price, category, stock } = req.body;
        const ProductId = req.params.id;
        
        
        const existingProduct = await product.findById(ProductId);
        if (!existingProduct) {
            return next(createNotFoundError('Product'));
        }
        

        const updateData = { name, price, category, stock };
        
        // If new image uploaded, delete old one and use new
        if (req.file) {
            // Delete old image if exists
            if (existingProduct.image) {
                const oldImagePath = path.join(__dirname, '..', existingProduct.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
            updateData.image = `/uploads/products/${req.file.filename}`;
        }
        
        const updatedProduct = await product.findByIdAndUpdate(
            ProductId, 
            updateData,
            { new: true } // Return updated document
        );
        
        return res.status(200).json({ 
            success: true, 
            message: 'Product updated successfully',
            product: updatedProduct 
        });
    } catch (error) {
        next(error);
    }
}

async function handleDeleteProd(req, res, next) {
    try {
        const ProductId = req.params.id;
        const deletedProduct = await product.findByIdAndDelete(ProductId);
        
        // Delete associated image
        if (deletedProduct && deletedProduct.image) {
            const imagePath = path.join(__dirname, '..', deletedProduct.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }
        
        return res.status(200).json({ 
            success: true, 
            message: 'Product deleted successfully' 
        });
    } catch (error) {
        next(error);
    }
}

async function handleShowAllProd(req, res, next) {
    try {
        const products = await product.find({ seller: req.user.id });

        if (!products || products.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No product Added',
                products: []
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Product found!',
            products
        });
    } catch(err) {
        next(err);
    }
}

async function handleGetSellerOrders(req,res,next) {
    try {
        const sellerId = req.user.id;

        const orders = await Order.find({ 
            seller: sellerId,
            status: { $in: ['Pending','Confirmed','Processing','Shipped']}
        })
        .populate('carts.product')
        .populate('user','name email phone')
        .sort({ createdAt: -1 });

        if(orders.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No active orders',
                orders: []
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Active orders retrived successfully',
            orders,
            count: orders.length
        })
    } catch (error) {
        next(error);
    }
}

async function handleGetSellerOrderHistory(req,res,next) {
    try {
        const sellerId = req.user.id;

        const orders = await Order.find({ 
            seller: sellerId,
            status: { $in: ['Delivered','Cancelled']}
        })
        .populate('carts.product')
        .populate('user','name email phone')
        .sort({ createdAt: -1 });

        if(orders.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No order history',
                orders: []
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order history retrived successfully',
            orders,
            count: orders.length
        })
    } catch (error) {
        next(error);
    }
}

async function handleChangeOrderStatus(req,res,next) {
    try {
        const sellerId = req.user.id;
        const orderId = req.params.orderId;
        const { changedStatus } = req.body;

        if (!orderId) {
            return next(createValidationError('orderId is required!'));
        }

        const response = await Order.findById(orderId);

        if (response.seller.toString() !== sellerId.toString()) {
            return next(createForbiddenError('You can only change the status of your own order'));
        }

        if (response.status === 'Delivered' || response.status === 'Cancelled') {
            return next(createValidationError(`Cannot update ${response.status.toLowerCase()} orders`));
        }

        response.status = changedStatus;
        await response.save();

        return res.status(201).json({
            success: true,
            message: 'Status changed successfully',
            updatedOrder: response
        })
    } catch (error) {
        next(error);
    }
}

export { handlePostProd, handleUpdateProd, handleDeleteProd, handleShowAllProd, handleGetSellerOrders, handleGetSellerOrderHistory, handleChangeOrderStatus };