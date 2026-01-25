import mongoose from 'mongoose';

const contactSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Please enter a valid email']
    },
    subject:{
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }

}, {timestamps: true});

export default mongoose.model('Contact', contactSchema);