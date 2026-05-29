# EMarket — Full-Stack MERN E-Commerce

A production-grade e-commerce web application built with MongoDB, Express, React, and Node.js.

## Features

- **Authentication** — JWT (httpOnly cookies), refresh token rotation, email verification, password reset via OTP
- **Products** — Full CRUD, search, category/brand/price/rating filters, pagination, variants, reviews
- **Cart** — Persistent cart, real-time quantity updates, coupon/promo codes
- **Orders** — COD payment, Stripe placeholder, order tracking, email notifications
- **Wishlist** — Toggle wishlist with optimistic UI updates
- **Admin Panel** — Dashboard with revenue charts, product/order/user/category/coupon management
- **Image Upload** — Cloudinary via Multer
- **Email** — Nodemailer (order confirmation, shipping updates, password reset OTP)
- **SEO** — Dynamic `<title>` and meta tags via react-helmet-async
- **Security** — Helmet, CORS, mongo-sanitize, rate limiting, bcryptjs

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit + RTK Query, React Router v6, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (httpOnly cookies), bcryptjs |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer |
| Charts | Recharts |
| Payments | COD + Stripe placeholder |

## Project Structure

```
ecommerce-mern/
├── backend/
│   ├── config/          # DB & Cloudinary config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, error, rate limit, upload
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # Token, email, API features
│   ├── seeder.js        # Database seeder
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Route-level page components
│       ├── redux/       # Store, slices, RTK Query endpoints
│       └── utils/       # Helpers, formatters
├── .env.example
└── package.json         # Root with concurrently scripts
```

## Quick Start

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd ecommerce-mern
npm run install:all
```

### 2. Configure environment variables

```bash
cp .env.example backend/.env
# Edit backend/.env with your values
```

Required variables:
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` and `JWT_REFRESH_SECRET` — any long random strings
- `CLOUDINARY_*` — from your Cloudinary dashboard
- `SMTP_*` — Gmail SMTP credentials (enable App Password)

### 3. Seed the database

```bash
npm run seed
```

This creates:
- **Admin**: `admin@emarket.com` / `admin123`
- **Customer**: `john@example.com` / `user123`
- 10 sample products, 5 categories, 3 coupons

### 4. Run in development

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### 5. Build for production

```bash
npm run build
```

## API Reference

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login |
| POST | `/logout` | Logout |
| POST | `/refresh-token` | Refresh access token |
| GET | `/verify-email/:token` | Verify email |
| POST | `/forgot-password` | Send OTP |
| POST | `/reset-password` | Reset with OTP |

### Products (`/api/products`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List products (filters, sort, pagination) |
| GET | `/featured` | Featured products |
| GET | `/:slug` | Product detail |
| POST | `/` | Create (admin) |
| PUT | `/:id` | Update (admin) |
| DELETE | `/:id` | Delete (admin) |
| POST | `/:id/reviews` | Add review |

### Orders (`/api/orders`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create order |
| GET | `/my-orders` | My orders |
| GET | `/:id` | Order detail |
| PUT | `/:id/cancel` | Cancel order |
| GET | `/` | All orders (admin) |
| PUT | `/:id/status` | Update status (admin) |

### Cart (`/api/cart`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get cart |
| POST | `/add` | Add item |
| PUT | `/update` | Update quantity |
| DELETE | `/remove/:productId` | Remove item |
| DELETE | `/clear` | Clear cart |
| POST | `/coupon` | Apply coupon |
| DELETE | `/coupon` | Remove coupon |

## Query Parameters (Products)

| Param | Type | Example |
|-------|------|---------|
| `keyword` | string | `?keyword=laptop` |
| `category` | ObjectId | `?category=64a...` |
| `brand` | string | `?brand=Apple` |
| `minPrice` | number | `?minPrice=50` |
| `maxPrice` | number | `?maxPrice=500` |
| `rating` | number | `?rating=4` |
| `inStock` | boolean | `?inStock=true` |
| `sort` | string | `?sort=-price` or `?sort=price` |
| `page` | number | `?page=2` |
| `limit` | number | `?limit=12` |

## Admin Panel

Navigate to `/admin` after logging in with the admin account. Features:
- **Dashboard** — Revenue charts (Recharts), recent orders, top products, stats cards
- **Products** — CRUD with image upload, stock management
- **Orders** — Filter by status, update status, add tracking numbers
- **Users** — View all customers, change roles, delete
- **Categories** — CRUD with image upload, nested subcategories
- **Coupons** — Percentage/fixed discounts, usage limits, expiry dates

## Demo Coupon Codes

| Code | Type | Value | Notes |
|------|------|-------|-------|
| `WELCOME10` | Percentage | 10% | No minimum, max $50 discount |
| `SAVE20` | Fixed | $20 off | Min order $100 |
| `FLASH50` | Percentage | 50% | Min $200, max $100 discount |

## Deployment Notes

- Set `NODE_ENV=production` in backend
- Set `CLIENT_URL` to your frontend domain
- Use a MongoDB Atlas cluster for production
- Configure Cloudinary for image hosting
- Set up a Stripe account and update `STRIPE_SECRET_KEY` to enable card payments
- Use PM2 or similar to keep the Node server running

## License

MIT
