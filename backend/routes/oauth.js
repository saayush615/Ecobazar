import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv'
import { createToken } from '../services/auth.js'

dotenv.config();

const router = express.Router();

router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile','email'] 
    })
)

router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
        session: false
    }),
  async function(req, res) {
    try {
        const token = createToken(req.user);

        res.cookie('uid',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.redirect(`${process.env.FRONTEND_URL}/?auth=google_success`)
    } catch (error) {
        console.error(`OAuth error: ${error}`);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_failed`)
    }
  });

export default router;