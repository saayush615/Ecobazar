import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    originalPrice:{
        type: Number,
        required: true
    },
    discountPrice:{
        type: Number
    },
    category:{
        type: String,
    },
    stock:{
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to the 'user' collection
    },
    description: {
        type: String,
        default: ''
    },
    
}, {timestamps: true});

export default mongoose.model('Product', productSchema);