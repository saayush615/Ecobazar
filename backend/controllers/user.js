import User from '../models/user.js';
import { setPassword, checkPassword } from '../services/hashpass.js';
import { createToken, checkToken } from '../services/auth.js';
import AppError from '../utils/AppError.js';
import { createNotFoundError, createUnauthorizedError } from '../utils/ErrorFactory.js'

async function handleSignup(req,res,next) {
    try {
        const { name, email, password, role} = req.body;

         // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return next(new AppError('User already exist!',409));
        }

        // Hash the password before saving
        const hashedPassword = await setPassword(password);

        // Create the user
        const user = await User.create({ name, email,password: hashedPassword, role});
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