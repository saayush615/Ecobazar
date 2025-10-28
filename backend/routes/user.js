import express from 'express';
import { handleSignup, handleLogin} from '../controllers/user.js';

const router = express.Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);

router.get('/logout', (req,res) => { 
    res.clearCookie('uid');
    return res.redirect('/');
 })

export default router;