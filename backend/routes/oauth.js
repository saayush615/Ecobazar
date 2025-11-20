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
        // req.user from Passport is a Mongoose document
        // JWT requires a plain object, not a Mongoose document

        // ✅ FIX: Convert Mongoose document to plain object
        const token = createToken({ 
            id: req.user._id,           // Extract only needed fields
            role: req.user.role 
        });

        res.cookie('uid',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',  // sameSite: 'strict' blocks cookies on these cross-site redirects
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.redirect(`${process.env.FRONTEND_URL}/?auth=google_success`)
    } catch (error) {
        console.error(`Google OAuth error: ${error}`);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_failed`)
    }
  });

router.get('/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile']  //  Facebook accounts require app verification for email and public_profile access
  })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
    session: false 
  }),
  async function(req, res) {
    try {
        // Successful authentication, redirect home.
        // console.log('req.user:', req.user);

        const token = createToken({ 
            id: req.user._id,
            role: req.user.role 
        });

        res.cookie('uid',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',  // sameSite: 'strict' blocks cookies on these cross-site redirects
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.redirect(`${process.env.FRONTEND_URL}/?auth=facebook_success`);
    } catch (error) {
        console.log(`Facebook OAuth error: ${error}`);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_failed`)
    }
  });

export default router;