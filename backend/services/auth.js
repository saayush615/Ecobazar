import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.secret;

function createToken(payload) {
    const token = jwt.sign(payload, secret, {expiresIn: '24h'}); // Token expires in 1 hour
    return token;
}

function checkToken(token) {
    if (!token) return null;
    try {
        const isMatch = jwt.verify(token, secret);
        return isMatch;
        // Returns the decoded payload (an object) if token is valid
        // Throws an error if token is invalid
    } catch (error) {
        return null;
    }
}

export { createToken, checkToken };