import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';

import { checkAuthentication } from './middlewares/auth.js';
import { adminOnly } from './middlewares/admin.js';

import userRoute from './routes/user.js';
import productRoute from './routes/product.js';
import cartRoute from './routes/cart.js';
import adminRoute from './routes/admin.js';
import orderRoute from './routes/order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config();

// Middleware to parse JSON payloads
// This allows your server to accept and parse JSON data in request bodies
// Essential for handling POST/PUT requests with JSON data
app.use(express.json());

app.use(cookieParser()); //cookie-parser parses the Cookie header from incoming HTTP requests and makes cookies accessible as a JavaScript object via req.cookies.

// Middleware to parse URL-encoded bodies
// This allows your server to handle form data submissions
// extended: true allows for nested objects and arrays in form data
// Required for processing HTML form submissions and complex request bodies
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(checkAuthentication);

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGOOSE_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
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


const port = process.env.PORT || 3000;

app.listen(port, () => { 
    console.log(`The server is running on ${port}`);
    
 })
