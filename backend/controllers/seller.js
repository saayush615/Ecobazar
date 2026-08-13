import product from '../models/product.js';
import cart from '../models/cart.js';
import Order from '../models/order.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { createValidationError, createNotFoundError, createForbiddenError, createFileUploadError } from '../utils/ErrorFactory.js'
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { deleteCache, deleteCacheByPattern } from '../services/cache.js';
import { invalidateStock } from '../services/stock.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cleanupLocalFile = (req) => {
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }
};

const handlePostProd = asyncHandler(async (req, res, next) => {
    const { name, originalPrice, discountPrice, category, stock } = req.body;
    const seller = req.user.id;

    let imageUrl = null;

    if (req.file) {
        const localFilePath = req.file.path;
        imageUrl = await uploadToCloudinary(localFilePath);

        if (!imageUrl) {
            return next(createFileUploadError('Failed to upload image to cloudinary'));
        }
    }
    
    const newProduct = await product.create({ 
        name, 
        originalPrice,
        discountPrice,
        category, 
        stock, 
        image: imageUrl,
        seller 
    });

    await deleteCacheByPattern('products:*');
    
    return res.status(201).json({ 
        success: true, 
        message: 'Product created successfully', 
        product: newProduct 
    });
}, cleanupLocalFile)

const handleUpdateProd = asyncHandler(async (req, res, next) => {
    const { name, originalPrice, discountPrice, category, stock } = req.body;
    const ProductId = req.params.id;
    
    
    const existingProduct = await product.findById(ProductId);
    if (!existingProduct) {
        return next(createNotFoundError('Product'));
    }
    

    const updateData = { name, originalPrice, discountPrice, category, stock };
    

    if (req.file) {

        if (existingProduct.image) {
            await deleteFromCloudinary(existingProduct.image);
        }

        const localFilePath = req.file.path;
        const imageUrl = await uploadToCloudinary(localFilePath);

        if (!imageUrl) {
            return next(createFileUploadError('Failed to upload new image!'));
        }

        updateData.image = imageUrl;
    }
    
    const updatedProduct = await product.findByIdAndUpdate(
        ProductId, 
        updateData,
        { new: true } // Return updated document
    );

    await invalidateStock(ProductId); // stock:${productId}

    await deleteCacheByPattern('products:*');
    await deleteCache(`product:${ProductId}`);
    
    return res.status(200).json({ 
        success: true, 
        message: 'Product updated successfully',
        product: updatedProduct 
    });
}, cleanupLocalFile)

const handleDeleteProd = asyncHandler(async (req, res, next) => {
    const ProductId = req.params.id;
    const deletedProduct = await product.findByIdAndDelete(ProductId);

     await invalidateStock(ProductId); // stock:${productId}

    await deleteCacheByPattern('products:*');
    await deleteCache(`product:${ProductId}`);
    
    // Delete associated image
    if (deletedProduct && deletedProduct.image) {
        await deleteFromCloudinary(deletedProduct.image);
    }
    
    return res.status(200).json({ 
        success: true, 
        message: 'Product deleted successfully' 
    });
})

const handleShowAllProd = asyncHandler(async (req, res, next) => {
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
})

const handleGetSellerOrders = asyncHandler(async (req,res,next) => {
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
})

const handleGetSellerOrderHistory = asyncHandler(async (req,res,next) => {
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
})

const handleChangeOrderStatus = asyncHandler(async (req,res,next) => {
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
})

const handleGetAnalytics = asyncHandler(async (req, res, next) => {
    // Order.find({ seller: '6a60...' }) → Mongoose auto-casts the string to ObjectId('6a60...') before querying → matches.
    //  Order.aggregate([{ $match: { seller: '6a60...' } }]) → Mongoose does not cast that string here. MongoDB compares seller (ObjectId) with a String → never equal → 0 documents.
    const sellerId = new mongoose.Types.ObjectId(req.user.id);
    const LOW_STOCK_THRESHOLD = 10;

    const [orderAggs, productAggs] = await Promise.all([
        Order.aggregate([ // Start an aggregation pipeline on the Order collection.
            { $match: { seller: sellerId } }, // Only process this seller's orders.
            { $facet: { // Now take those orders and run multiple independent aggregation pipelines on it at the same time.
                stats: [
                    { $group: { // Combine documents into groups and calculate something about each group.
                        _id: null, // Put all orders into one single group.
                        totalOrders: { $sum: 1 }, // Count every document.
                        totalRevenue: { // only from delivered orders
                            $sum: {
                                $cond: [
                                    { $eq: ['$status', 'Delivered'] },
                                    '$totalAmount',
                                    0
                                ]
                            }
                        },
                        deliveredOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] }
                        },
                        cancelledOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] }
                        }
                    } }
                ],
                salesTrend: [
                    { $match: { createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } } }, // Only consider orders created within the last 90 days.
                    { $group: { // group requires _id to define the grouping key -> that is why project at last
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        revenue: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$status', 'Delivered'] },
                                    '$totalAmount',
                                    0
                                ]
                            }
                        },
                        orders: { $sum: 1 }
                    } },
                    { $sort: { _id: 1 } }, // ascending
                    { $project: { _id: 0, date: '$_id', revenue: 1, orders: 1 } } // Shape the final output. [_id: 0] -> removes _id && [date: '$_id'] -> renames _id to date
                ],
                orderStatus: [
                    { $group: { _id: '$status', count: { $sum: 1 } } },
                    { $project: { _id: 0, status: '$_id', count: 1 } }
                ],
                paymentMethod: [
                    { $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
                    { $project: { _id: 0, method: '$_id', count: 1 } }
                ],
                paymentStatus: [
                    { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
                    { $project: { _id: 0, status: '$_id', count: 1 } }
                ],
                categoryRevenue: [
                    { $match: { status: 'Delivered' } },
                    { $unwind: '$carts' },
                    { $lookup: {
                        from: 'products',
                        localField: 'carts.product',
                        foreignField: '_id',
                        as: 'product'
                    } },
                    { $unwind: '$product' },
                    { $group: {
                        _id: '$product.category',
                        revenue: {
                            $sum: {
                                $multiply: [
                                    '$carts.quantity',
                                    { $ifNull: ['$product.discountPrice', '$product.originalPrice'] }
                                ]
                            }
                        },
                        units: { $sum: '$carts.quantity' }
                    } },
                    { $project: { _id: 0, category: '$_id', revenue: 1, units: 1 } }
                ],
                topProducts: [
                    { $unwind: '$carts' },
                    { $lookup: {
                        from: 'products',
                        localField: 'carts.product',
                        foreignField: '_id',
                        as: 'product'
                    } },
                    { $unwind: '$product' },
                    { $group: {
                        _id: '$product.name',
                        units: { $sum: '$carts.quantity' },
                        revenue: {
                            $sum: {
                                $multiply: [
                                    '$carts.quantity',
                                    { $ifNull: ['$product.discountPrice', '$product.originalPrice'] }
                                ]
                            }
                        }
                    } },
                    { $sort: { revenue: -1 } },
                    { $limit: 8 },
                    { $project: { _id: 0, name: '$_id', units: 1, revenue: 1 } }
                ]
            } }
        ]),
        product.aggregate([
            { $match: { seller: sellerId } },
            { $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                lowStockCount: {
                    $sum: { $cond: [{ $lte: ['$stock', LOW_STOCK_THRESHOLD] }, 1, 0] }
                },
                stockLevels: {
                    $push: { name: '$name', stock: '$stock' }
                }
            } },
            { $project: { _id: 0, totalProducts: 1, lowStockCount: 1, stockLevels: 1 } }
        ])
    ]);

    const orderFacet = orderAggs[0] || {};
    const stats = orderFacet.stats?.[0] || { totalOrders: 0, totalRevenue: 0, deliveredOrders: 0, cancelledOrders: 0 };
    stats.avgOrderValue = stats.deliveredOrders > 0
        ? Number((stats.totalRevenue / stats.deliveredOrders).toFixed(2))
        : 0;

    const productData = productAggs[0] || { totalProducts: 0, lowStockCount: 0, stockLevels: [] };

    return res.status(200).json({
        success: true,
        analytics: {
            stats,
            salesTrend: orderFacet.salesTrend || [],
            orderStatus: orderFacet.orderStatus || [],
            paymentMethod: orderFacet.paymentMethod || [],
            paymentStatus: orderFacet.paymentStatus || [],
            categoryRevenue: orderFacet.categoryRevenue || [],
            topProducts: orderFacet.topProducts || [],
            ...productData
        }
    });
})

export { handlePostProd, handleUpdateProd, handleDeleteProd, handleShowAllProd, handleGetSellerOrders, handleGetSellerOrderHistory, handleChangeOrderStatus, handleGetAnalytics };
