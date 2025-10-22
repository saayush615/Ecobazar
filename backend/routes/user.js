const express = require('express');
const router = express.Router();
const { handleSignup, handleLogin} = require('../controllers/user')

router.post('/signup', handleSignup);
router.post('/login', handleLogin);

router.get('/logout', (req,res) => { 
    res.clearCookie('uid');
    return res.redirect('/');
 })

module.exports = router;