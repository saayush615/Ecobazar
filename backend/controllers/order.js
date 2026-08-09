import razorpayInstance from '../config/razorpay.js';
import Order from '../models/order.js';
import Cart from '../models/cart.js';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import asyncHandler from '../utils/asyncHandler.js';
import { createValidationError, createNotFoundError, createUnauthorizedError } from '../utils/ErrorFactory.js';
import { getAvailableStock, decreaseStock, releaseReservedStock, increaseStock } from '../services/stock.js';

// Step 1: Create Razorpay Order
const handleCreateOrder = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const checkoutSessionId = uuidv4();
    
    const cartItems = await Cart.find({ user: userId })
        .populate({
            path: 'product',
            populate: {
                path: 'seller',
                select: 'name email shopName'
            }
        });
    
    if (cartItems.length === 0) {
        return next(createValidationError('Cart is empty'));
    }

    // GROUP ITEMS BY SELLER
    const sellerGroups = cartItems.reduce((groups, cartItem) => {

        const sellerId = cartItem.product?.seller?._id.toString();

        if (!groups[sellerId]) {
            // Make the group of seller with sellerId
            groups[sellerId] = {
                seller: cartItem.product.seller,
                items: []
            };
        }
        
        // Push the items by that seller group.
        groups[sellerId].items.push(cartItem);
        
        return groups;
    }, {});

    // grand total amount
    const totalAmount = cartItems.reduce((sum, item) => {
        const price = item.product?.discountPrice || item.product?.originalPrice;
        return sum + (item.quantity * price);
    }, 0);

    const reservedItems = [];
    for (const item of cartItems) {
        const productId = item.product?._id;
        const quantity = item.quantity;

        const available = await getAvailableStock(productId);
        if (available < quantity) {
            await releaseReservedStock(reservedItems);   // roll back earlier items
            return next(createValidationError(`Only ${available} units of "${item.product.name}" available`));
        }

        const reserved = await decreaseStock(productId, quantity);
        if (!reserved) {
            await releaseReservedStock(reservedItems);   // roll back earlier items
            return next(createValidationError(`Insufficient stock for "${item.product.name}"`));
        }

        reservedItems.push({ productId, quantity });
    }

    // Razorpay order option
    const options = {
        amount: totalAmount * 100, // Razorpay expects amount in paise (smallest currency unit)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
            userId: userId.toString(),
            orderType: 'ecommerce',
            checkoutSessionId: checkoutSessionId
        }
    };

    let razorpayOrder;
    // Create multiple orders - one pre seller
    const createdOrders = [];

    try{
    // Create razorpay order
    razorpayOrder = await razorpayInstance.orders.create(options);

    for (const [sellerId, groupData] of Object.entries(sellerGroups)) {
        // Calculate subtotal for this seller's items
        const sellerSubtotal = groupData.items.reduce((sum, item) => {
            const price = item.product?.discountPrice || item.product?.originalPrice;
            return sum + (item.quantity * price);
        }, 0);
        
        // Prepare cart items for this seller only
        const sellerCartItems = groupData.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        }));
        
        // Create order for this seller
        const order = await Order.create({
            user: userId,
            seller: sellerId,
            sellerShopName: groupData.seller?.shopName,
            checkoutSessionId: checkoutSessionId,
            carts: sellerCartItems,
            totalAmount: sellerSubtotal,
            paymentMethod: 'razorpay',
            razorpayOrderId: razorpayOrder.id,
            paymentStatus: 'pending',
            status: 'Pending'
        });
        
        createdOrders.push(order);
    }

    } catch (error) {
        await releaseReservedStock(reservedItems);
        return next(error);
    }

    return res.status(201).json({
        success: true,
        message: 'Order created successfully',
        razorpayOrder: {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency
        },
        orders: createdOrders.map(order => ({
            id: order._id,
            seller: order.sellerShopName,
            amount: order.totalAmount
        })),
        checkoutSessionId: checkoutSessionId,
        key: process.env.RAZORPAY_API_KEY
    });
})

// Step 2: Verify Payment Signature
const handleVerifyPayment = asyncHandler(async (req, res, next) => {
    const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature,
        checkoutSessionId 
    } = req.body;

    // Create signature for verification
    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    // Verify signature
    if (generated_signature !== razorpay_signature) {
        return next(createValidationError('Payment verification failed'));
    }

    // Update order with payment details
    const updateResult = await Order.updateMany(
        { 
            checkoutSessionId: checkoutSessionId,
            paymentStatus: 'pending'
        },
        {
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            paymentStatus: 'completed',
            status: 'Confirmed'
        }
    );


    const orders = await Order.find({ checkoutSessionId: checkoutSessionId });

    await Cart.deleteMany({ user: req.user.id });

    return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        orders: orders,
        ordersCount: updateResult.modifiedCount
    });
})

// Step 3: Handle Payment Failure
const handlePaymentFailure = asyncHandler(async (req, res, next) => {
    const { checkoutSessionId } = req.body;

    const orders = await Order.find({ checkoutSessionId, paymentStatus: 'pending' });

    for (const order of orders) {
        for (const cartItem of order.carts) {
            await increaseStock(cartItem.product, cartItem.quantity);
        }
    }

    const updateResult = await Order.updateMany(
        { checkoutSessionId, paymentStatus: 'pending' },
        { paymentStatus: 'failed', status: 'Cancelled' }
    );

    return res.status(200).json({
        success: true,
        message: 'Payment failure recorded',
        orders: orders,
        ordersCount: updateResult.modifiedCount
    });
})

const handleCODOrder = asyncHandler(async (req,res,next) => {
    const userId = req.user.id;
    const checkoutSessionId = uuidv4();

    const cartItems = await Cart.find({ user: userId })
        .populate({
            path: 'product',
            populate: {
                path: 'seller',
                select: 'name email shopName'
            }
        });
    if (cartItems.length === 0) {
        return next(createValidationError('Cart is empty'));
    }
// groups = { s1: { seller: {}, items:[]}, s2: { seller: {}, items:[]}}
    const sellerGroups = cartItems.reduce((groups, cartItem) => {
        const sellerId = cartItem.product?.seller?._id.toString();

        if(!groups[sellerId]) {
            groups[sellerId] = {
                seller: cartItem.product?.seller,
                items: []
            };
        }

        groups[sellerId].items.push(cartItem);

        return groups;
    }, {});

    const totalAmount = cartItems.reduce((sum, item) => {
        const price = item.product?.discountPrice || item.product?.originalPrice;
        return sum + (item.quantity * price);
    }, 0);

    const reservedItems = [];
    for (const item of cartItems) {
        const productId = item.product?._id;
        const quantity = item.quantity;

        const available = await getAvailableStock(productId);
        if (available < quantity) {
            await releaseReservedStock(reservedItems);
            return next(createValidationError(`Only ${available} units of "${item.product.name}" available`));
        }

        const reserved = await decreaseStock(productId, quantity);
        if (!reserved) {
            await releaseReservedStock(reservedItems);
            return next(createValidationError(`Insufficient stock for "${item.product.name}"`));
        }

        reservedItems.push({ productId, quantity });
    }

    const createdOrders = [];

    try{

    for (const [sellerId, groupData] of Object.entries(sellerGroups)) {
        const sellerSubtotal = groupData.items.reduce((sum, item) => {
            const price = item.product?.discountPrice || item.product?.originalPrice;
            return sum + (item.quantity * price);
        },0);

        const sellerCartItems = groupData.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        }));

        const order = await Order.create({
            user: userId,
            seller: sellerId,
            sellerShopName: groupData.seller?.shopName,
            checkoutSessionId: checkoutSessionId,
            carts: sellerCartItems,
            totalAmount: sellerSubtotal,
            paymentMethod: 'cod',
            paymentStatus: 'pending',
            status: 'Confirmed'
        });

        createdOrders.push(order);
    }
    } catch(error){
        await releaseReservedStock(reservedItems);
        return next(error);
    }

    await Cart.deleteMany({ user: userId });

    return res.status(201).json({
        success: true,
        message: 'Order placed successfully with Cash on Delivery',
        order: createdOrders.map(order => ({
            id: order._id,
            seller: order.sellerShopName,
            amount: order.totalAmount
        })),
        grandTotalAmount: totalAmount,
        checkoutSessionId: checkoutSessionId
    });
})

const handleGetMyOrders = asyncHandler(async (req,res,next) => {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
        .populate('carts.product')
        .populate('seller', 'name shopName email')
        .sort({ createdAt: -1 });

    const groupedBySession = orders.reduce((acc, order) => {
        const sessionId = order.checkoutSessionId;

        if (!acc[sessionId]) {
            acc[sessionId] = {
                checkoutSessionId: sessionId,
                createdAt: order.createdAt,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                orders: [],
                totalAmount: 0
            }
        }

        acc[sessionId].orders?.push(order);
        acc[sessionId].totalAmount += order.totalAmount;

        return acc;
    }, {});

    return res.status(200).json({
        success: true,
        message: 'Fetched order success',
        checkouts: groupedBySession
    });
})

const handleCancelOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return next(createNotFoundError('Order not found'));
    }
    
    if (order.user.toString() !== req.user.id) {
      return next(createUnauthorizedError('Not authorized'));
    }
    
    if (!['Pending', 'Confirmed'].includes(order.status)) {
      return next(createValidationError('Order cannot be cancelled'));
    }

    if (order.status === 'Confirmed') {
    for (const cartItem of order.carts) {
            await increaseStock(cartItem.product, cartItem.quantity);
        }
    }

    // If Payment status == 'confirmed' 
    // refund logic is left
    
    order.status = 'Cancelled';
    await order.save();
    
    res.status(200).json({ success: true, message: 'Order cancelled', order });
})

export { handleCreateOrder, handleVerifyPayment, handlePaymentFailure, handleCODOrder, handleGetMyOrders, handleCancelOrder };
