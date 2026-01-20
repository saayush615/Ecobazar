import razorpayInstance from '../config/razorpay.js';
import Order from '../models/order.js';
import Cart from '../models/cart.js';
import crypto from 'crypto';
import { createValidationError, createNotFoundError } from '../utils/ErrorFactory.js';

// Step 1: Create Razorpay Order
async function handleCreateOrder(req, res, next) {
    try {
        const userId = req.user.id;
        
        const cartItems = await Cart.find({ user: userId }).populate('product');
        
        if (cartItems.length === 0) {
            return next(createValidationError('Cart is empty'));
        }

        // total amount
        const totalAmount = cartItems.reduce((sum, item) => {
            const price = item.product?.discountPrice || item.product?.originalPrice;
            return sum + (item.quantity * price);
        }, 0);

        // Razorpay order option
        const options = {
            amount: totalAmount * 100, // Razorpay expects amount in paise (smallest currency unit)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: userId.toString(),
                orderType: 'ecommerce'
            }
        };

        // Create razorpay order
        const razorpayOrder = await razorpayInstance.orders.create(options);

        // Create order in database
        const newCart = cartItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        }));

        const order = await Order.create({
            user: userId,
            carts: newCart,
            totalAmount,
            paymentMethod: 'razorpay',
            razorpayOrderId: razorpayOrder.id,
            paymentStatus: 'pending',
            status: 'Pending'
        });

        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency
            },
            orderId: order._id,
            key: process.env.RAZORPAY_API_KEY
        });

    } catch (error) {
        next(error);
    }
}

// Step 2: Verify Payment Signature
async function handleVerifyPayment(req, res, next) {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            orderId 
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
        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                paymentStatus: 'completed',
                status: 'Confirmed'
            },
            { new: true }
        );

        if (!order) {
            return next(createNotFoundError('Order'));
        }

        // Clear cart after successful payment
        await Cart.deleteMany({ user: req.user.id });

        return res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            order
        });

    } catch (error) {
        next(error);
    }
}

// Step 3: Handle Payment Failure
async function handlePaymentFailure(req, res, next) {
    try {
        const { orderId } = req.body;

        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                paymentStatus: 'failed',
                status: 'Cancelled'
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Payment failure recorded',
            order
        });

    } catch (error) {
        next(error);
    }
}

async function handleCODOrder(req,res,next) {
    try{
        const userId = req.user.id;

        const cartItems = await Cart.find({ user: userId }).populate('product');
        if (cartItems.length === 0) {
            return next(createValidationError('Cart is empty'));
        }

        const totalAmount = cartItems.reduce((sum, item) => {
            const price = item.product?.discountPrice || item.product?.originalPrice;
            return sum + (item.quantity * price);
        }, 0);

        const newCart = cartItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        }));

        const order = await Order.create({
            user: userId,
            carts: newCart,
            totalAmount,
            paymentMethod: 'cod',
            paymentStatus: 'pending',
            status: 'Confirmed'
        });

        await Cart.deleteMany({ user: userId });

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully with Cash on Delivery',
            order: {
                id: order._id,
                totalAmount: order.totalAmount,
                paymentMethod: order.paymentMethod,
                status: order.status
            }
        });
        
    } catch (error) {
        next(error);
    }
}

async function handleGetMyOrders(req,res,next) {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ user: userId }).populate('carts.product').sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: 'Fetched order success',
            orders
        });

    } catch (error) {
        next(error);
    }
}

async function handleCancelOrder(req, res, next) {
  try {
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
    
    order.status = 'Cancelled';
    await order.save();
    
    res.status(200).json({ success: true, message: 'Order cancelled', order });
  } catch (error) {
    next(error);
  }
}

export { handleCreateOrder, handleVerifyPayment, handlePaymentFailure, handleCODOrder, handleGetMyOrders, handleCancelOrder };