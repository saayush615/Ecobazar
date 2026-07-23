import express from 'express';
import { handleSignup, handleLogin, handleAuthentication } from '../controllers/user.js';
import { registerSchema, loginSchema } from "../schema/auth.schema.js";
import { validateBody } from "../middlewares/validate.js";

const router = express.Router();

router.post('/signup', validateBody(registerSchema), handleSignup);
router.post('/login', validateBody(loginSchema), handleLogin);

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