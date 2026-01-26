# Ecobazar
A modern, full-featured _e-commerce marketplace_ built with the MERN stack that enables users to **buy** and **sell** organic products with ease. Features include **OAuth authentication**, **payment integration**, and a beautiful **dark mode** UI.

## Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Routing:** React Router DOM v7
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Form Handling:** React Hook Form
- **HTTP Client:** Axios
- **Notifications:** Sonner (Toast notifications)
- **Image Slider:** Swiper.js

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB (Mongoose ODM)
- **Authentication & Authorization:**
  - Passport.js (Google/Facebook OAuth 2.0)
  - JWT (JSON Web Tokens)
  - Bcrypt (Password hashing)
- **File Uploads:** Multer
- **Payment Gateway:** Razorpay
- **Security & Middleware:** Cookie-parser, CORS

## Key Features

### User Features
- **Authentication:** Email/Password login and Google/Facebook OAuth
- **Product Browsing:** Search, filter, and category-based navigation [**❌ Not Yet Made**]
- **Shopping Cart:** Add/remove items with quantity management
- **Wishlist:** Save favorite products for later
- **Order Management:** Place orders and view order history
- **Payment Integration:** Secure payments via Razorpay
- **Dark Mode:** Complete dark mode support
- **Responsive Design:** Mobile-first, fully responsive UI

### Seller Features
- **Seller Dashboard:** Dedicated dashboard for sellers
- **Product Management:** Add, edit, and delete products
- **Image Upload:** Product image uploads using Multer
- **Order Tracking:** View and manage customer orders.[**❌ Not Yet Made**]
- **Sales Analytics:** Dashboard with sales statistics and insights.[**❌ Not Yet Made**]

### Technical Features
- **JWT Authentication:** Secure token-based authentication using HTTP-only cookies
- **OAuth 2.0:** Google authentication with Passport.js
- **File Uploads:** Image upload with validation and secure storage
- **Payment Verification:** Razorpay signature verification for secure transactions
- **Error Handling:** Centralized global error-handling middleware
- **Protected Routes:** Role-based access control (RBAC)
- **Context API:** Global state management for cart and wishlist
- **Form Validation:** Client-side validation using React Hook Form


## Project Structure

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
│   │   │   ├── seller/      # Seller dashboard components
│   │   │   ├── Header.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TestimonySlider.jsx
│   │   │   └── ...
│   │   ├── contexts/        # React Context providers
│   │   │   ├── CartContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useAuth.js
│   │   ├── lib/             # Utility functions
│   │   │   └── utils.js
│   │   ├── pages/           # Route components
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Orders.jsx
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
│   │   └── upload.js       # Multer file upload config
│   ├── controllers/         # Route handlers
│   │   ├── cart.js
│   │   ├── contact.js
│   │   ├── favorite.js
│   │   ├── order.js
│   │   ├── product.js
│   │   ├── seller.js
│   │   └── user.js
│   ├── middlewares/         # Custom middleware
│   │   ├── AppError.js     # Custom error class
│   │   └── errorHandler.js # Global error handler
│   ├── models/              # Mongoose schemas
│   │   ├── cart.js
│   │   ├── contact.js
│   │   ├── favorite.js
│   │   ├── order.js
│   │   ├── product.js
│   │   └── user.js
│   ├── routes/              # API routes
│   │   ├── cart.js
│   │   ├── contact.js
│   │   ├── favorite.js
│   │   ├── oauth.js        # OAuth routes
│   │   ├── order.js
│   │   ├── product.js
│   │   ├── seller.js
│   │   └── user.js
│   ├── services/            # Business logic
│   │   └── auth.js         # JWT token creation/verification
│   ├── uploads/             # User uploaded files (gitignored)
│   │   └── products/
│   ├── utils/               # Helper functions
│   ├── .env                 # Environment variables
│   ├── index.js             # Server entry point
│   ├── package.json
│   └── Readme.md            # Backend documentation & notes
│
├── .gitignore               # Root gitignore
└── Readme.md                # This file

```

## Getting Started

### Prerequisites
- **Node.js:** v18 or higher
- **MongoDB:** Local instance or MongoDB Atlas
- **Razorpay Account:** Required for payment integration
- **Google Cloud Console Project:** Required for Google OAuth setup

### Backend Setup
1. **Navigate to backend directory**
```bash
cd backend
```
2. **Install dependencies**
```bash
npm install
```
3.**Create** `.env` **file**
```bash
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGOOSE_URI=mongodb://localhost:27017/ecobazar

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
```
4. **Start the server**
```bash
npm run dev
```
Server will run on `http://localhost:3000`

### Frontend Setup
1. **Navigate to frontend directory**
```bash
cd frontend
```
2. **Install dependencies**
```bash
npm install
```
3. **Create** `.env` **file**
```bash
VITE_API_URL=http://localhost:3000
```
4. **Start the development server**
```bash
npm run dev
```
App will run on `http://localhost:5173`


## API Routes

### Authentication
- **POST** `/user/signup` — User registration  
- **POST** `/user/login` — User login  
- **POST** `/user/logout` — User logout  
- **GET** `/user/me` — Get user detail.
- **GET** `/oauth/google` — Initiate Google OAuth  
- **GET** `/oauth/google/callback` — Google OAuth callback  
- **GET** `/oauth/facebook` — Initiate Facebook OAuth  
- **GET** `/oauth/facebook/callback` — Facebook OAuth callback  

### Products [**❌ Yet to improve**]
- **GET** `/product/all` — Get all products  
- **GET** `/product/:id` — Get a single product.
- **POST** `/seller/product` — Add a product *(Seller only)*  
- **PUT** `/seller/product/:id` — Update a product *(Seller only)* .[**❌ Not Yet Made**]
- **DELETE** `/seller/product/:id` — Delete a product *(Seller only)*. [**❌ Not Yet Made**]

### Cart & Wishlist [**❌ Yet to improve**]
- **GET** `/cart` — Get user cart  
- **POST** `/cart` — Add item to cart  
- **DELETE** `/cart/:id` — Remove item from cart  

- **GET** `/favorite` — Get wishlist items  
- **POST** `/favorite` — Add item to wishlist  
- **DELETE** `/favorite/:id` — Remove item from wishlist  

### Orders [**❌ Yet to improve**]
- **POST** `/order` — Create an order  
- **GET** `/order` — Get user orders  
- **POST** `/order/verify-payment` — Verify Razorpay payment  

### Contact
- **POST** `/contact` — Submit contact form

### Seller
- **GET** `/seller/getProduct` — Get product posted by seller
- **POST** `/seller/product` — Post the product.
- **PUT** `/seller/edit/:id` — Edit the product info
- **PUT** `/seller/status/:id` — 
- **Delete** `/seller/remove/:id` — Remove the product

## UI Components (shadcn/ui)

The project leverages **shadcn/ui** components located in the `ui` directory, built on top of Radix UI primitives:

- **Card**
- **Dialog**
- **Sheet** (Mobile drawer)
- **Navigation Menu**
- **Table**
- **Sonner** (Toaster notifications)
- **And more…**

---

## Security Features

- **JWT with HTTP-only Cookies:** Prevents XSS-based token access
- **Password Hashing:** Secure password storage using Bcrypt
- **CORS Configuration:** Controlled cross-origin requests
- **File Upload Validation:** Enforced type and size restrictions
- **Payment Signature Verification:** Razorpay webhook/signature validation
- **Protected Routes:** Role-based access control (RBAC)
- **Input Sanitization:** Client-side and server-side form validation

---

## Contributing

This is a learning-focused project. Contributions are welcome!

- Fork the repository  
- Create a new feature branch  
- Make your changes  
- Submit a pull request  

---

## License

This project is intended **solely for educational purposes**.

---

##  Author

Built with ❤️ as a full-stack learning project.
