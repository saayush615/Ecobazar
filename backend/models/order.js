import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    carts: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            require: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],

    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['razorpay', 'cod'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    },
    
    status: {
        type: String,
        required: true,
        default: 'Pending',
        enum: [
            'Pending',
            'Confirmed',
            'Processing',
            'Shipped',
            'Delivered',
            'Cancelled'
        ]
    }
}, {timestamps: true});

export default mongoose.model('Order', orderSchema);