const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password should be at least 6 characters']
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user','admin'] // Restrict the role to this values
    }
}, {timestamps: true}); // Adds createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);