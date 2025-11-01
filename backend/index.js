import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import passport from 'passport';

import './config/passport.js'
import { connectToDB } from './config/database.js'

import { checkAuthentication } from './middlewares/auth.js';
import { adminOnly } from './middlewares/admin.js';
import { globalglobalErrorHandler } from './middlewares/errorHandler.js'

import userRoute from './routes/user.js';
import productRoute from './routes/product.js';
import cartRoute from './routes/cart.js';
import adminRoute from './routes/admin.js';
import orderRoute from './routes/order.js';
import oAuthRoute from './routes/oauth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config();

app.use(passport.initialize());
app.use(express.json());

app.use(cookieParser()); //cookie-parser parses the Cookie header from incoming HTTP requests and makes cookies accessible as a JavaScript object via req.cookies.

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(checkAuthentication);


connectToDB();

app.get('/', (req,res) => {
    return res.status(200).json({
        success: true,
        message: 'Welcome to Ecobazar'
    })
}); 

app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);
app.use('/admin', adminOnly, adminRoute);
app.use('/oauth', oAuthRoute);

app.use('*', (req,res) => {
    return res.status(404).json({
        success: false,
        error: `Route not found`
    })
})

app.use(globalglobalErrorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => { 
    console.log(`The server is running on ${port}`);
    
 })
