import express from 'express';
import { handleSignup, handleLogin, handleAuthentication } from '../controllers/user.js';

const router = express.Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);

router.get('/me', handleAuthentication)

router.post('/logout', (_req,res) => { 
    res.clearCookie('uid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    return res.status(200).json({
        success: true,
        message: 'Logout Successfull'
    });
 })

export default router;