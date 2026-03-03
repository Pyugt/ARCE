# ARCÉ — Full-Stack E-Commerce Platform

A production-quality e-commerce web application built with the MERN stack (MongoDB, Express.js, React, Node.js). Features a modern UI, JWT authentication, admin dashboard, shopping cart, and full order management.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![Node](https://img.shields.io/badge/Node.js-Express-green?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-darkgreen?logo=mongodb) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)

---

## Features

- **Authentication** — JWT-based login/register with bcrypt password hashing,
- **Product Catalog** — Search, filter by category, pagination
- **Product Details** — Full detail view with customer reviews and star ratings
- **Shopping Cart** — Add, update quantity, remove items, persistent per user
- **Checkout** — Shipping address form, payment method selection, mock payment
- **Order Management** — Order history, order detail page
- **Admin Dashboard** — Full product CRUD, order status management
- **Protected Routes** — Auth guards on frontend and backend
- **Responsive UI** — Mobile-first design with Tailwind CSS

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18, Vite, Tailwind CSS      |
| Routing     | React Router v6                   |
| HTTP Client | Axios                             |
| Backend     | Node.js, Express.js               |
| Database    | MongoDB with Mongoose             |
| Auth        | JWT + bcryptjs                    |
| Dev Tools   | Nodemon, Vite HMR                 |

---

## Project Structure

```
ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login, getMe
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── seed.js                # Database seeder
│   ├── server.js              # Express entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js       # Axios instance + interceptors
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── Spinner.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── AdminRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Global auth state
    │   │   └── CartContext.jsx  # Global cart state
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── OrderSuccessPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── AdminPage.jsx
    │   │   └── NotFoundPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) (Community Server) running locally
- [Git](https://git-scm.com/)

---

## Local Setup — Step by Step

### 1. Clone the Repository

```bash
git clone https://github.com/Pyugt/ARCE.git
cd ecommerce
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
# Copy the example
copy .env.example .env        # Windows
# cp .env.example .env        # Mac/Linux
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running locally. On Windows with MongoDB installed as a service, it should start automatically. You can also run:

```bash
# If MongoDB is not running as a service:
mongod
```

### 4. Seed the Database

```bash
# From the backend/ directory
node seed.js
```

This creates:
- **Admin**: `admin@shop.com` / `admin123`
- **User**: `john@example.com` / `password123`
- 12 sample products

### 5. Start the Backend Server

```bash
# From the backend/ directory
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on http://localhost:5000 [development]
```

### 6. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### 7. Open the App

Visit **http://localhost:5173** in your browser.

---

## Demo Credentials

| Role  | Email                | Password    |
|-------|----------------------|-------------|
| Admin | admin@shop.com       | admin123    |
| User  | john@example.com     | password123 |

---

## API Documentation

### Authentication

| Method | Endpoint              | Access  | Description        |
|--------|-----------------------|---------|--------------------|
| POST   | `/api/auth/register`  | Public  | Register new user  |
| POST   | `/api/auth/login`     | Public  | Login user         |
| GET    | `/api/auth/me`        | Private | Get current user   |

### Products

| Method | Endpoint                     | Access       | Description            |
|--------|------------------------------|--------------|------------------------|
| GET    | `/api/products`              | Public       | Get all products       |
| GET    | `/api/products/:id`          | Public       | Get single product     |
| POST   | `/api/products`              | Admin        | Create product         |
| PUT    | `/api/products/:id`          | Admin        | Update product         |
| DELETE | `/api/products/:id`          | Admin        | Delete product         |
| POST   | `/api/products/:id/reviews`  | Private      | Add review             |

**Query Parameters for GET /api/products:**
- `keyword` — search by name
- `category` — filter by category
- `page` — pagination (default: 1)
- `limit` — per page (default: 12)

### Cart

| Method | Endpoint              | Access  | Description           |
|--------|-----------------------|---------|-----------------------|
| GET    | `/api/cart`           | Private | Get user's cart       |
| POST   | `/api/cart`           | Private | Add item to cart      |
| PUT    | `/api/cart/:productId`| Private | Update item quantity  |
| DELETE | `/api/cart/:productId`| Private | Remove item           |
| DELETE | `/api/cart`           | Private | Clear cart            |

### Orders

| Method | Endpoint                  | Access  | Description             |
|--------|---------------------------|---------|-------------------------|
| POST   | `/api/orders`             | Private | Create order (checkout) |
| GET    | `/api/orders/myorders`    | Private | Get user's orders       |
| GET    | `/api/orders/:id`         | Private | Get order by ID         |
| GET    | `/api/orders`             | Admin   | Get all orders          |
| PUT    | `/api/orders/:id/status`  | Admin   | Update order status     |

---

## Scripts

### Backend
```bash
npm run dev    # Start with nodemon (auto-restart)
npm start      # Start in production mode
node seed.js   # Seed the database
```

### Frontend
```bash
npm run dev    # Start Vite dev server (hot reload)
npm run build  # Build for production
npm run preview # Preview production build
```

---

## Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

