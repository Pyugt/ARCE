# ARCÉ — Full-Stack E-Commerce Platform

A production-quality e-commerce web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Features a modern UI, JWT authentication, admin dashboard, shopping cart, and full order management.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-darkgreen?logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)

---

## Features

### Customer
- **Authentication** — Register/login with JWT. Passwords hashed with bcrypt.
- **Product catalog** — Search by keyword, filter by category, paginated results.
- **Product detail** — Full page with image, description, and star-rated reviews.
- **Shopping cart** — Add, update quantity, remove items. Persisted per user in the database.
- **Checkout** — Shipping address form, payment method selection, mock payment flow.
- **Order history** — View all past orders with full order detail pages.

### Admin
- **Product CRUD** — Create, edit, and delete products from the admin panel.
- **Order management** — View all orders and update their status (pending → processing → shipped → delivered).
- **Protected routes** — Frontend and backend guards ensure only admins can access admin pages.

### UI
- Responsive, mobile-first design built with Tailwind CSS.
- React Router v6 for client-side navigation.
- Axios with request/response interceptors for clean API communication.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| Dev Tools | Nodemon, Vite HMR |

---

## Project Structure

```
ARCE/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, getMe
│   │   ├── productController.js   # Product CRUD + reviews
│   │   ├── cartController.js      # Cart operations
│   │   ├── orderController.js     # Checkout + order management
│   │   └── userController.js      # User admin actions
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect + adminOnly
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
│   ├── seed.js                    # Database seeder
│   ├── server.js                  # Express entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js           # Axios instance + interceptors
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── Spinner.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── AdminRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx    # Global auth state
    │   │   └── CartContext.jsx    # Global cart state
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

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/Pyugt/ARCE.git
cd ARCE
```

### 2. Configure the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Seed the database

```bash
# From the backend/ directory
node seed.js
```

This creates 12 sample products and two demo accounts:

| Role | Email | Password |
|---|---|---|
| Admin | admin@shop.com | admin123 |
| User | john@example.com | password123 |

### 4. Start the backend

```bash
# From the backend/ directory
npm run dev
```

Expected output:
```
✅ MongoDB Connected: localhost
🚀 Server running on http://localhost:5000 [development]
```

### 5. Start the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## API Reference

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create a new account |
| `POST` | `/api/auth/login` | Public | Log in, returns JWT |
| `GET` | `/api/auth/me` | Private | Get the current user |

### Products

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List all products |
| `GET` | `/api/products/:id` | Public | Get a single product |
| `POST` | `/api/products` | Admin | Create a product |
| `PUT` | `/api/products/:id` | Admin | Update a product |
| `DELETE` | `/api/products/:id` | Admin | Delete a product |
| `POST` | `/api/products/:id/reviews` | Private | Submit a review |

**Query parameters for `GET /api/products`:**
- `keyword` — search by product name
- `category` — filter by category slug
- `page` — page number (default: `1`)
- `limit` — results per page (default: `12`)

### Cart

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/cart` | Private | Get the current user's cart |
| `POST` | `/api/cart` | Private | Add an item |
| `PUT` | `/api/cart/:productId` | Private | Update item quantity |
| `DELETE` | `/api/cart/:productId` | Private | Remove an item |
| `DELETE` | `/api/cart` | Private | Clear the cart |

### Orders

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Private | Place an order (checkout) |
| `GET` | `/api/orders/myorders` | Private | Get the current user's orders |
| `GET` | `/api/orders/:id` | Private | Get a single order |
| `GET` | `/api/orders` | Admin | Get all orders |
| `PUT` | `/api/orders/:id/status` | Admin | Update order status |

---

## Scripts

### Backend

```bash
npm run dev    # Start with nodemon (auto-restart on file changes)
npm start      # Start in production mode
node seed.js   # Seed demo data into the database
```

### Frontend

```bash
npm run dev      # Start Vite dev server with hot reload
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview the production build locally
```

---

## Environment Variables

All backend config goes in `backend/.env`. See `backend/.env.example` for the full list.

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on (default: `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs — **change this before deploying** |
| `JWT_EXPIRE` | JWT expiry duration (e.g. `7d`) |
| `NODE_ENV` | `development` or `production` |

---

## Deployment

### Frontend — Vercel / Netlify

```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

Set `VITE_API_URL=https://your-backend-url.com/api` in your hosting environment variables.

### Backend — Render / Railway / Fly.io

1. Push the `backend/` folder (or the whole monorepo).
2. Set all `.env` variables in your host's environment config.
3. Set the start command to `npm start`.
4. Use [MongoDB Atlas](https://www.mongodb.com/atlas) for the hosted database and update `MONGO_URI`.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a pull request

