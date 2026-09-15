# 🌿 Ecobazar

A modern, full-featured _e-commerce marketplace_ built with the MERN stack that enables users to **buy** and **sell** organic products with ease. Features include **OAuth authentication**, **payment integration**, and a beautiful **dark mode** UI.

🎥 **YouTube Demo:** [Watch the demo](https://www.youtube.com/watch?v=aeabq4fRP28)

## 🚀 Tech Stack

### 💻 Frontend
- **Framework:** React 19 (Vite)
- **Routing:** React Router DOM v7
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Form Handling:** React Hook Form + Zod
- **State Management:** TanStack Query v5 (Redux Toolkit legacy)
- **Tables:** TanStack Table
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Notifications:** Sonner (Toast notifications)
- **Image Slider:** Swiper.js

### ⚙️ Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB (Mongoose ODM)
- **Authentication & Authorization:**
  - Passport.js (Google/Facebook OAuth 2.0)
  - JWT (JSON Web Tokens)
  - Bcrypt (Password hashing)
- **File Uploads:** Multer + Cloudinary
- **Validation:** Zod
- **Caching:** Redis (ioredis)
- **Payment Gateway:** Razorpay
- **Security & Middleware:** Cookie-parser, CORS, express-rate-limit
- **Background Jobs:** node-cron (order cleanup)

## ✨ Key Features

### 👤 User Features
- 🔐 **Authentication:** Email/Password login and Google/Facebook OAuth
- 🔍 **Product Browsing:** Search with suggestions, filter, and category-based navigation
- ⭐ **Reviews & Ratings:** Rate and review products
- 🛒 **Shopping Cart:** Add/remove items with quantity management
- ❤️ **Wishlist:** Save favorite products for later
- 📦 **Order Management:** Place orders and view order history
- 💳 **Payment Integration:** Secure payments via Razorpay
- 🌙 **Dark Mode:** Complete dark mode support
- 📱 **Responsive Design:** Mobile-first, fully responsive UI

### 🏪 Seller Features
- 📊 **Seller Dashboard:** Dedicated dashboard for sellers
- 📝 **Product Management:** Add, edit, and delete products
- 🖼️ **Image Upload:** Product image uploads using Multer + Cloudinary
- 📋 **Order Tracking:** View and manage customer orders with status updates
- 📈 **Sales Analytics:** Dashboard with sales statistics, charts and insights

### 🔧 Technical Features
- 🔑 **JWT Authentication:** Secure token-based authentication using HTTP-only cookies
- 🔐 **OAuth 2.0:** Google authentication with Passport.js
- 📤 **File Uploads:** Image upload with validation and Cloudinary storage
- ⚡ **Caching:** Redis caching for products and stock management
- 🚦 **Rate Limiting:** Redis-backed rate limiting on auth/contact routes
- ✅ **Payment Verification:** Razorpay signature verification for secure transactions
- ⚠️ **Error Handling:** Centralized global error-handling middleware
- 🛡️ **Protected Routes:** Role-based access control (RBAC)
- 🌐 **TanStack Query:** Server-state management for cart, wishlist, products and orders
- ✔️ **Form Validation:** Client-side validation using React Hook Form + Zod


## 📁 Project Structure

```
Ecobazar/
├── .github/
│   ├── instructions/          # Development guidelines
│   └── prompts/
│       └── senior-mern-mentor.prompt  # AI assistant configuration
│
├── frontend/
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── assets/           # Images, fonts, etc.
│   │   ├── components/
│   │   │   ├── ui/          # Shadcn UI components (dialog, sheet, card, etc.)
│   │   │   ├── seller/      # Seller dashboard components + charts/
│   │   │   ├── Header.jsx
│   │   │   ├── HeaderSearch.jsx
│   │   │   ├── Rating.jsx
│   │   │   ├── DataTable.jsx (seller)
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TestimonySlider.jsx
│   │   │   └── ...
│   │   ├── contexts/        # React Context providers
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/           # Custom React hooks (TanStack Query)
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.jsx / useWishlist.jsx / useProduct.jsx
│   │   │   ├── useOrder.jsx / useSeller.jsx / useReview.jsx
│   │   │   └── useDebounce.jsx
│   │   ├── lib/             # Utility functions + API layer
│   │   │   ├── axios.js
│   │   │   ├── queryClient.js
│   │   │   ├── utils.js
│   │   │   └── api/        # auth, cart, wishlist, product, order, seller, review
│   │   ├── schemas/         # Zod client-side schemas
│   │   ├── store/           # Redux slices (legacy, being phased out)
│   │   ├── pages/           # Route components
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashbord.jsx (seller dashboard)
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Category.jsx / Cart.jsx / Wishlist.jsx
│   │   │   └── Orders.jsx / Settings.jsx
│   │   ├── App.jsx          # Main app component with routes
│   │   ├── App.css
│   │   ├── index.css        # Tailwind imports
│   │   └── main.jsx         # React entry point
│   ├── .env                 # Environment variables
│   ├── .gitignore
│   ├── components.json      # Shadcn UI configuration
│   ├── eslint.config.js
│   ├── index.html
│   ├── jsconfig.json        # Path aliases configuration
│   ├── package.json
│   ├── README.md            # Frontend documentation & notes
│   └── vite.config.js
│
├── backend/
│   ├── config/              # Configuration files
│   │   ├── database.js     # MongoDB connection
│   │   ├── passport.js     # OAuth strategies
│   │   ├── razorpay.js     # Payment gateway config
│   │   ├── redis.js        # Redis connection
│   │   ├── cloudinary.js   # Image storage config
│   │   └── upload.js       # Multer file upload config
│   ├── controllers/         # Route handlers
│   │   ├── cart.js
│   │   ├── contact.js
│   │   ├── favorite.js
│   │   ├── order.js
│   │   ├── product.js
│   │   ├── review.js
│   │   ├── seller.js
│   │   └── user.js
│   ├── middlewares/         # Custom middleware
│   │   ├── auth.js         # JWT check
│   │   ├── authorization.js # Role-based guards
│   │   ├── validate.js     # Zod body/query validation
│   │   ├── rateLimit.js    # Redis-backed rate limiting
│   │   └── errorHandler.js # Global error handler
│   ├── models/              # Mongoose schemas
│   │   ├── cart.js
│   │   ├── contact.js
│   │   ├── favorite.js
│   │   ├── order.js
│   │   ├── product.js
│   │   ├── review.js
│   │   └── user.js
│   ├── routes/              # API routes
│   │   ├── cart.js
│   │   ├── contact.js
│   │   ├── favorite.js
│   │   ├── oauth.js        # OAuth routes
│   │   ├── order.js
│   │   ├── product.js
│   │   ├── review.js
│   │   ├── seller.js
│   │   └── user.js
│   ├── schema/              # Zod request schemas
│   ├── services/            # Business logic
│   │   ├── auth.js         # JWT token creation/verification
│   │   ├── cache.js        # Redis cache helpers
│   │   ├── stock.js        # Stock validation/management
│   │   └── orderCleanup.js # Cron cleanup for stale orders
│   ├── uploads/             # User uploaded files (gitignored)
│   │   └── products/
│   ├── utils/               # Helper functions (AppError, ErrorFactory)
│   ├── .env.example         # Environment variables template
│   ├── Dockerfile
│   ├── .env                 # Environment variables
│   ├── index.js             # Server entry point
│   ├── package.json
│   └── Readme.md            # Backend documentation & notes
│
├── .gitignore               # Root gitignore
└── Readme.md                # This file

```

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js:** v18 or higher
- **MongoDB:** Local instance or MongoDB Atlas
- **Redis:** Local instance or hosted (required for caching + rate limiting)
- **Razorpay Account:** Required for payment integration
- **Google Cloud Console Project:** Required for Google OAuth setup

### ⚙️ Backend Setup
1️⃣ **Navigate to backend directory**
```bash
cd backend
```
2. **Install dependencies**
```bash
npm install
```
3️⃣ **Create** `.env` **file**
```bash
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/ecobazar

# Redis (caching + rate limiting)
REDIS_URL=redis://localhost:6379

# JWT Secret
secret=your_jwt_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Razorpay
RAZORPAY_API_KEY=your_razorpay_key_id
RAZORPAY_SECRET_KEY=your_razorpay_secret_key

# Cloudinary (product image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Order cleanup
ORDER_CLEANUP_GRACE_MINUTES=60
```
4️⃣ **Start the server**
```bash
npm run dev
```
Server will run on `http://localhost:3000`

### 💻 Frontend Setup
1️⃣ **Navigate to frontend directory**
```bash
cd frontend
```
2️⃣ **Install dependencies**
```bash
npm install
```
3️⃣ **Create** `.env` **file**
```bash
VITE_API_URL=http://localhost:3000
```
4️⃣ **Start the development server**
```bash
npm run dev
```
App will run on `http://localhost:5173`


## 🔌 API Routes

### 🔐 Authentication
- **POST** `/user/signup` — User registration  
- **POST** `/user/login` — User login  
- **POST** `/user/logout` — User logout  
- **GET** `/user/me` — Get user detail.
- **GET** `/oauth/google` — Initiate Google OAuth  
- **GET** `/oauth/google/callback` — Google OAuth callback  
- **GET** `/oauth/facebook` — Initiate Facebook OAuth  
- **GET** `/oauth/facebook/callback` — Facebook OAuth callback  

### 🛍️ Products
- **GET** `/product/all` — Get all products  
- **GET** `/product/search` — Search products with filters  
- **GET** `/product/suggest` — Search suggestions for autocomplete  
- **GET** `/product/filter/:category` — Get products by category  
- **GET** `/product/:id` — Get a single product.

### ⭐ Reviews
- **GET** `/review/product/:productId` — Get product reviews  
- **POST** `/review/product/:productId` — Add a review (buyer only)  
- **DELETE** `/review/:reviewId` — Delete a review (buyer only)

### 🛒 Cart & Wishlist
- **GET** `/cart` — Get user cart  
- **POST** `/cart/:id` — Add item to cart  
- **PUT** `/cart/:id` — Update cart product Quantity  
- **DELETE** `/cart/:id` — Remove item from cart  

- **GET** `/fav` — Get wishlist items  
- **POST** `/fav` — Add item to wishlist  
- **DELETE** `/fav/:favoriteId` — Remove item from wishlist  

### 📦 Orders
- **POST** `/order/cod-order` — Create an order with cash on delivery payment option. 
- **GET** `/order` — Get user orders
- **PUT** `/order/:id` - Cancel Order  
- **POST** `/order/create-order` — Create an order with payment done online with razorpay.  
- **POST** `/order/verify-payment` — Verify Razorpay payment signature.
- **POST** `/order/payment-failure` — Handle payment failure  

### 📧 Contact
- **POST** `/contact` — Submit contact form

### 🏪 Seller
- **GET** `/seller/` — Get all product posted by seller.
- **POST** `/seller/` — Post the product.
- **PUT** `/seller/:id` — Edit the product info
- **Delete** `/seller/:id` — Remove the product
- **GET** `/seller/orders` — Get active seller orders
- **GET** `/seller/order-history` — Get seller order history
- **GET** `/seller/analytics` — Get sales analytics
- **PATCH** `/seller/orderStatus/:orderId` — Update order status

### 🩺 Health
- **GET** `/health` — Health check

## 🎨 UI Components (shadcn/ui)

The project leverages **shadcn/ui** components located in the `ui` directory, built on top of Radix UI primitives:

- 🃏 **Card**
- 💬 **Dialog**
- 📱 **Sheet** (Mobile drawer)
- 🧭 **Navigation Menu**
- 📊 **Table**
- ⌨️ **Command** (Search palette)
- 🔔 **Sonner** (Toaster notifications)
- ✨ **And more…**

---

## 🔒 Security Features

- 🍪 **JWT with HTTP-only Cookies:** Prevents XSS-based token access
- 🔐 **Password Hashing:** Secure password storage using Bcrypt
- 🌐 **CORS Configuration:** Controlled cross-origin requests
- 📤 **File Upload Validation:** Enforced type and size restrictions
- ✅ **Payment Signature Verification:** Razorpay webhook/signature validation
- 🚦 **Rate Limiting:** Redis-backed throttling on auth/contact routes
- 🛡️ **Protected Routes:** Role-based access control (RBAC)
- 🧹 **Input Sanitization:** Client-side and server-side form validation

---

## 🤝 Contributing

This is a learning-focused project. Contributions are welcome!

1. 🍴 Fork the repository  
2. 🌱 Create a new feature branch  
3. ✏️ Make your changes  
4. 🚀 Submit a pull request

---

## 🙏 Credits & Acknowledgments

### 🎨 UI Design
The visual design and user interface of this project are based on the excellent work of **[Templatecookie](https://www.figma.com/@templatecookie)**. Their design is publicly available and free to use.

- **Designer:** [Templatecookie](https://www.figma.com/@templatecookie)
- **Original Design:** [shopery](https://www.figma.com/community/file/1272474484693685580/shopery-organic-ecommerce-shop-website-figma-template-community)

Special thanks for creating such a beautiful and functional design that made this learning project possible!

### 💻 Technologies
Built with amazing open-source technologies:
- React, Express.js, MongoDB, Node.js
- shadcn/ui components
- Tailwind CSS

---

## 📄 License

This project is intended **solely for educational purposes**.

---

## 👨‍💻 Author

Built with ❤️ as a full-stack learning project.
