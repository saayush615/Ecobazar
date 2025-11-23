import User from '../models/user.js';
import { setPassword, checkPassword } from '../services/hashpass.js';
import { createToken, checkToken } from '../services/auth.js';
import AppError from '../utils/AppError.js';
import { createNotFoundError, createUnauthorizedError, createValidationError, createDuplicateError } from '../utils/ErrorFactory.js'

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
                return next(createDuplicateError('Business registration number'))
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
        const user = await User.findOne({ email }).select('+password');
        if(!user){
            return next(createNotFoundError('User'))
        }
    
        // Validate the password
        const passwordvalidate = await checkPassword(password, user.password);
        if(!passwordvalidate){
            return next(createUnauthorizedError('Invalid password'));
        }
    
        // Create a token with user ID and role
        const token = createToken({ 
            id: user._id , 
            name: user.name, 
            email: user.email, 
            role: user.role, 
            ...(user.role === 'seller' && { shopName: user.shopName, businessRegNo: user.businessRegNo, businessAddress: user.businessAddress })
        });

        res.cookie('uid',token, {
            httpOnly: true,                                          // Prevents JavaScript access (XSS protection)
            secure: process.env.NODE_ENV === 'production',          // HTTPS only in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',  // Allow cross-origin
            maxAge: 24 * 60 * 60 * 1000                             // 24 hours
        });

        return res.status(200).json({
            success: true,
            message: 'Login Successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                ...(user.role === 'seller' && { shopName: user.shopName, businessRegNo: user.businessRegNo, businessAddress: user.businessAddress })
            }
        });
    } catch(err) {
        next(err);
    }

}

async function handleAuthentication (req,res,next) {
    try {
        // req.user is set by checkAuth middleware if user is authenticated
        if (req.user) {
            return res.status(200).json({
                success: true,
                user: {
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role,
                    ...(req.user.role === 'seller' && { shopName: req.user.shopName, businessRegNo: req.user.businessRegNo, businessAddress: req.user.businessAddress })
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }
    } catch (error) {
        next(error);
    }
}

export { handleSignup, handleLogin, handleAuthentication };