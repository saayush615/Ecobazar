import express from 'express';
import { handleSignup, handleLogin, handleAuthentication } from '../controllers/user.js';

const router = express.Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);

router.get('/me', handleAuthentication)

router.get('/logout', (req,res) => { 
    res.clearCookie('uid');
    return res.status(200).json({
        success: true,
        message: 'Logout Successfull'
    });
 })

export default router;