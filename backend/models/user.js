import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: function() {
            return this.authProvider === 'local';
        },
        unique: true,
        match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: function(){
            return !this.googleId && !this.facebookId;
        },
        minlength: [6, 'Password should be at least 6 characters'],
        select: false  // 🔒 Password won't be returned by default
    },
    role: {
        type: String,
        required: true,
        default: 'buyer',
        enum: ['buyer','seller','admin'] // Restrict the role to this values
    },

    // Buyer-specific fields (optional)
    phone: {
        type: String,
        required: function() {
            return this.role === 'buyer' && !this.googleId && !this.facebookId;
        }
    },
    address: {
        type: String
    },

    // Seller-specific fields (optional)
    shopName: {
        type: String,
        required: function() {
            return this.role === 'seller';
        }
    },
    businessRegNo: {
        type: String,
        required: function() {
            return this.role === 'seller';
        },
        unique: true,
        sparse: true
    },
    businessAddress: {
        type: String,
        required: function() {
            return this.role === 'seller';
        }
    },

    //  OAuth fields
    facebookId:{
        type: String, 
        unique: true,
        sparse: true
    },

    googleId:{
        type: String, 
        unique: true,
        sparse: true
    },
    authProvider:{
        type: String,
        enum: ['local','google','facebook'],
        default: 'local'
    }

}, {timestamps: true}); // Adds createdAt and updatedAt fields

export default mongoose.model('User', userSchema);