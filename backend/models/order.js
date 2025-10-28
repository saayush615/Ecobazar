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