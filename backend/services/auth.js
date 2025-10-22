const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.secret;

function createToken(payload) {
    const token = jwt.sign(payload, secret, {expiresIn: '1h'}); // Token expires in 1 hour
    return token;
}

function checkToken(token) {
    const isMatch = jwt.verify(token, secret);
    return isMatch;
    // Returns the decoded payload (an object) if token is valid
    // Throws an error if token is invalid
}

module.exports = { createToken, checkToken };