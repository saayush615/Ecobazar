const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const methodOverride = require('method-override');

const { checkAuthentication } = require('./middlewares/auth');
const { adminOnly } = require('./middlewares/admin');

const staticRoute = require('./routes/staticRoute');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const adminRoute = require('./routes/admin');
const orderRoute = require('./routes/order');

const app = express();

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

dotenv.config();

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use('/', staticRoute); // Use app.use() to include all routes from staticRoute
app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);
app.use('/admin', adminOnly, adminRoute);


const port = process.env.PORT || 3000;

app.listen(port, () => { 
    console.log(`The server is running on ${port}`);
    
 })
