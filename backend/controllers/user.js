import User from '../models/user.js';
import { setPassword, checkPassword } from '../services/hashpass.js';
import { createToken, checkToken } from '../services/auth.js';
import AppError from '../utils/AppError.js';
import { createNotFoundError, createUnauthorizedError, createValidationError, createDuplicateError } from '../utils/ErrorFactory.js'
import user from '../models/user.js';

async function handleSignup(req,res,next) {
    try {
        const { name, email, password, role, phone, address, shopName, businessRegNo, businessAddress } = req.body;

        // Validate role
        if (!['buyer','seller'].includes(role)) {
            return next(createValidationError('Invalid role. Must be either buyer or seller'));
        }

         // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return next(createDuplicateError('User'));
        }

        // Role-specific validation 
        if (role === 'seller') {
            if (!shopName || !businessRegNo || !businessAddress) {
                return next(createValidationError('Seller must provide shop name, business registration number, and business address'));
            }

            // Check if business registration number already exists
            const existingBusiness = await User.findOne({ businessRegNo });
            if (existingBusiness) {
                return next(createDuplicateError('Business registration number already exists'))
            }
        }

        // Hash the password before saving
        const hashedPassword = await setPassword(password);

        // Prepare user data based on role
        const userData = {
            name,
            email,
            password: hashedPassword,
            role
        };

        // Add role-specific fields 
        if (role === 'buyer') {
            if (phone) userData.phone = phone;
            if (address) userData.address = address;
        } else if (role === 'seller') {
            userData.shopName = shopName;
            userData.businessRegNo = businessRegNo;
            userData.businessAddress = businessAddress;
        }

        // Create the user
        const user = await User.create(userData);
        
        return res.status(201).json({
            success: true,
            message: 'Signup Successfully!, Proceed to login',
            user
        })
    } catch(err) {
        next(err)
    }
}

async function handleLogin(req,res,next) {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if(!user){
            return next(createNotFoundError('User'))
        }
    
        // Validate the password
        const passwordvalidate = await checkPassword(password, user.password);
        if(!passwordvalidate){
            return next(createUnauthorizedError('Invalid password'));
        }
    
        // Create a token with user ID and role
        const token = createToken({ id: user._id, role: user.role });

        res.cookie('uid',token);

        return res.status(200).json({
            success: true,
            message: 'Login Successfully',
            user
        });
    } catch(err) {
        next(err);
    }

}

export { handleSignup, handleLogin };