const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

const { adminOnly } = require('../middlewares/admin');

router.get('/', async (req,res) => {
   const products = await Product.find();
   return res.render('home', {user: req.user, products });
 });

 router.get('/signup', (req,res) => { 
    res.render('signup');
 });

 router.get('/login', (req,res) => { 
    res.render('login')
  })

  router.get('/adminPage', adminOnly, async (req,res) => { 
   const products = await Product.find({seller: req.user.id});
   return res.render('admin', {user: req.user, products });
 })

 router.get('/adminPage/EditProduct/:id', adminOnly, async (req,res) => {
   const productId = req.params.id;
   const product = await Product.findOne({ _id: productId});
   return res.render('edit', {user: req.user, product});
  })


 router.get('/adminPage/AddProduct', adminOnly, async (req,res) => {
   const products = await Product.find({seller: req.user.id});
   res.render('addProduct', {user: req.user, products});
 });

 router.get('/adminPage/orders', adminOnly, async (req,res) => { 
   const userId = req.user.id;
   const orders = await Order.find()
      .populate({
            path: 'carts.product',
            select: 'name price category seller' // Select fields you want from product
      });

    // Filter and flatten the array in one go
    const newOrders = orders
        .flatMap(order => order.carts
            .filter(cart => cart.product.seller.toString() === userId)
            .map(cart => ({
                name: cart.product.name,
                price: cart.product.price,
                category: cart.product.category,
                quantity: cart.quantity,
                orderStatus: order.status,
                orderId: order._id
            }))
        );

    console.log('Filtered Orders:', JSON.stringify(newOrders, null, 2));
        
   res.render('admin_order', {user: req.user, orders: newOrders });
  })

  router.get('/mycart', async (req,res) => { 
   try {
      const userId = req.user.id;

      // Find all cart items for the user
      let products = await Cart.find({ user: userId });

      // Populate the 'product' field
      products = await Promise.all( //  Promise.all() waits for all promises to complete
          products.map(pro => pro.populate('product')) // map() creates an array of promises
      );

      // 1. Promise.all with map:
      //  = forEach does not handle asynchronous operations properly. Instead, use map to create an array of promises and pass it to Promise.all to wait for all populate calls to complete.

      // 2. await for populate:
      // = The populate method is asynchronous, so you need to use await to ensure the fields are populated before proceeding.

         // Calculate total
         const total = products.reduce((sum, pro) => {
            return sum + (pro.product.price * pro.quantity);
         }, 0);

      // console.log(products); // Debugging: Check the populated products
      res.render('cart', { user: req.user, products, total });
  } catch (err) {
      console.error('Error populating cart:', err);
      res.status(500).send('Internal Server Error');
  }
   });

   router.get('/orders', async (req,res) => { 
      try{
         const userId = req.user.id;
         const orders = await Order.find({ user: userId })
            .populate({
                path: 'carts.product',
                select: 'name price category' // Select fields you want from product
            });

         // console.log('Orders:', JSON.stringify(orders, null, 2)); // Debugging: Check the populated orders
         // Parameter 1: orders - your data to stringify
         // Parameter 2: null - no custom replacer function
         // Parameter 3: 2 - number of spaces for pretty formatting

         res.render('order', { 
            user: req.user, 
            orders: orders 
        });
      } catch(err){
               console.error('Error fetching orders:', err);
               res.status(500).json({ error: 'Error fetching orders' });
         
      }
    })

module.exports = router;