import User from '../models/user.js';
import { setPassword, checkPassword } from '../services/hashpass.js';
import { createToken, checkToken } from '../services/auth.js';

async function handleSignup(req,res) {
    try {
        const { name, email, password, role} = req.body;

         // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: 'User already exist!'
            });
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
        console.log(`Signup Error: ${err}`);
        return res.status(500).json({
            success: false,
            message: 'Try again!'
        })
    }
}

async function handleLogin(req,res) {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User not found!'
            })
        }
    
        // Validate the password
        const passwordvalidate = await checkPassword(password, user.password);
        if(!passwordvalidate){
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            })
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
        console.log(`Login error: ${err}`);
        return res.status(500).json({
            success: false,
            message: 'Try again!'
        });
    }

}

export { handleSignup, handleLogin };