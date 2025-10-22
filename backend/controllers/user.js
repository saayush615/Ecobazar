const User = require('../models/user');
const { setPassword, checkPassword } = require('../services/hashpass');
const { createToken, checkToken } = require('../services/auth');

async function handleSignup(req,res) {
    try {
        const { name, email, password, role} = req.body;

         // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.redirect('/signup');
        }

        // Hash the password before saving
        const hashedPassword = await setPassword(password);

        // Create the user
        const user = await User.create({ name, email,password: hashedPassword, role});
        return res.redirect('/login')
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: 'signup again some error occured'})
    }
}

async function handleLogin(req,res) {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if(!user){
            return res.redirect('/login'); // Generic error message
        }
    
        // Validate the password
        const passwordvalidate = await checkPassword(password, user.password);
        if(!passwordvalidate){
            return res.redirect('/login'); // Generic error message
        }
    
        // Create a token with user ID and role
        const token = createToken({ id: user._id, role: user.role });

        res.cookie('uid',token);

        if(user.role === 'admin'){
            return res.redirect('/adminPage');
        }

        return res.redirect('/');
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: 'server-side error'});
    }

}

module.exports = { handleSignup, handleLogin};