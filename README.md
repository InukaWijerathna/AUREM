# AUREM — Curated Luxury E-Commerce

A full-stack MERN e-commerce platform for a luxury multi-category store. Built with MongoDB, Express, React, and Node.js.

## Brand

| Token | Hex | Usage |
|-------|-----|-------|
| Champagne | `#F5EDD8` | Page background |
| Parchment | `#EDE0C4` | Cards, navbar, surfaces |
| Sand Gold | `#D9C89A` | Borders, dividers |
| Deep Gold | `#7A5C28` | Logo, CTAs, prices |
| Espresso | `#2C2418` | Primary text, footer |
| Claret | `#6B1F1F` | Alerts, "last piece" badges |

**Typography:** Cormorant Garamond 300–600 (display) + Montserrat 300–500 (body)

**Categories:** Timepieces · Jewellery · Leather Goods · Accessories · Fragrance · Gifting

## Features

- **Authentication** — JWT access + refresh tokens (httpOnly cookies), email verification, OTP password reset
- **Products** — Full CRUD, keyword search, category / price / rating / stock filters, variants, reviews, featured flag
- **Cart** — Persistent server-side cart, quantity updates, coupon/promo codes with usage limits
- **Orders** — COD + Stripe integration, order status pipeline, email confirmations, tracking numbers
- **Wishlist** — Toggle with optimistic UI
- **Admin Panel** — Revenue charts, product / order / user / category / coupon management
- **Image Upload** — Multer + Cloudinary (falls back to local `/uploads` when unconfigured)
- **Email** — Nodemailer HTML templates (verification, password reset, order confirmation, shipping update)
- **SEO** — Dynamic `<title>` and meta tags via `react-helmet-async`
- **Security** — Helmet, CORS, mongo-sanitize, rate limiting, bcryptjs

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit + RTK Query, React Router v6, Tailwind CSS, Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (httpOnly cookies), bcryptjs |
| Payments | Stripe |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer |
| Charts | Recharts |

## Project Structure

```
aurem/
├── backend/
│   ├── config/          # DB connection & Cloudinary setup
│   ├── controllers/     # Route handlers (auth, products, orders, cart, …)
│   ├── middleware/      # Auth, error handler, rate limiter, upload, validation
│   ├── models/          # Mongoose schemas (User, Product, Order, Cart, Category, Coupon)
│   ├── routes/          # Express routers
│   ├── utils/           # Token generation, email sender, APIFeatures
│   ├── seeder.js        # Database seeder with AUREM sample data
│   └── server.js        # Express app entry point
├── frontend/
│   └── src/
│       ├── components/  # Layout, products, cart, UI primitives
│       ├── pages/       # Route-level pages (shop, checkout, admin, …)
│       ├── redux/       # Store, slices, RTK Query API endpoints
│       └── utils/       # Helpers and formatters
├── .env.example
└── package.json         # Root workspace with concurrently dev script
```

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd aurem
npm run install:all
```

### 2. Configure environment variables

```bash
cp .env.example backend/.env
# Fill in your values
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Long random string for access tokens |
| `JWT_REFRESH_SECRET` | ✅ | Long random string for refresh tokens |
| `CLOUDINARY_CLOUD_NAME` | Optional | Cloudinary dashboard → Cloud name |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Optional | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | Optional | Stripe secret key (enable card payments) |
| `STRIPE_WEBHOOK_SECRET` | Optional | Stripe webhook signing secret |
| `SMTP_HOST` | Optional | SMTP server (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | Optional | Usually `587` |
| `SMTP_USER` | Optional | SMTP username / email |
| `SMTP_PASS` | Optional | SMTP password or App Password |
| `CLIENT_URL` | ✅ | Frontend origin for CORS (e.g. `http://localhost:5173`) |

> Cloudinary and SMTP are optional for local development — images fall back to `backend/uploads/` and emails are silently skipped when unconfigured.

### 3. Seed the database

```bash
npm run seed
```

Creates 6 categories, 13 luxury products, 3 users, and 3 coupon codes.

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@aurem.com` | `admin123` |
| Customer | `isabelle@example.com` | `user123` |

To wipe all data:

```bash
npm run seed:destroy
```

### 4. Run in development

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend (Vite) | `http://localhost:5173` |
| Backend API | `http://localhost:5000` |
| Health check | `http://localhost:5000/api/health` |

### 5. Build for production

```bash
npm run build
```

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | — | Register + send verification email |
| GET | `/verify-email/:token` | — | Verify email address |
| POST | `/login` | — | Login, set httpOnly cookies |
| POST | `/logout` | — | Clear cookies |
| POST | `/refresh-token` | — | Rotate access token |
| POST | `/forgot-password` | — | Send OTP to email |
| POST | `/reset-password` | — | Reset password with OTP |

### Products — `/api/products`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | — | List with filters, sort, pagination |
| GET | `/featured` | — | Up to 8 featured pieces |
| GET | `/:slug` | — | Product detail by slug |
| GET | `/id/:id` | Admin | Product detail by ID |
| POST | `/` | Admin | Create (up to 6 images) |
| PUT | `/:id` | Admin | Update |
| DELETE | `/:id/images/:publicId` | Admin | Remove one image |
| DELETE | `/:id` | Admin | Delete product |
| POST | `/:id/reviews` | User | Add review |
| DELETE | `/:id/reviews/:reviewId` | User | Delete review |

### Orders — `/api/orders`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | User | Create order from cart |
| GET | `/my-orders` | User | Paginated order history |
| GET | `/:id` | User | Order detail |
| PUT | `/:id/cancel` | User | Cancel (pending/processing only) |
| PUT | `/:id/pay` | User | Mark as paid |
| GET | `/` | Admin | All orders, filter by status |
| PUT | `/:id/status` | Admin | Update status + tracking number |

### Cart — `/api/cart`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get or create cart |
| POST | `/add` | Add item (validates stock) |
| PUT | `/update` | Update quantity |
| DELETE | `/remove/:productId` | Remove item |
| DELETE | `/clear` | Empty cart |
| POST | `/coupon` | Apply coupon code |
| DELETE | `/coupon` | Remove coupon |

### Other endpoints

| Base | Description |
|------|-------------|
| `/api/categories` | CRUD categories (public read, admin write) |
| `/api/users` | User profile, addresses, avatar |
| `/api/wishlist` | Toggle / list / remove wishlist items |
| `/api/coupons` | Validate (user) + CRUD (admin) |
| `/api/payment` | Stripe payment intent + webhook |
| `/api/admin` | Dashboard stats aggregate |

## Product Query Parameters

| Param | Type | Example |
|-------|------|---------|
| `keyword` | string | `?keyword=watch` |
| `category` | ObjectId or slug | `?category=timepieces` |
| `minPrice` | number | `?minPrice=500` |
| `maxPrice` | number | `?maxPrice=5000` |
| `rating` | number | `?rating=4` |
| `inStock` | boolean | `?inStock=true` |
| `isFeatured` | boolean | `?isFeatured=true` |
| `sort` | string | `?sort=-price` |
| `page` | number | `?page=2` |
| `limit` | number | `?limit=24` |

## Admin Panel

Navigate to `/admin` after logging in as admin.

| Section | Features |
|---------|----------|
| Dashboard | Monthly revenue chart, recent orders, top products, KPI cards |
| Products | CRUD with multi-image upload, stock, variants, featured flag |
| Orders | Filter by status, mark shipped with tracking number |
| Users | List, role change, delete |
| Categories | CRUD with image, nested subcategories |
| Coupons | Percentage / fixed, min order, max discount, usage limit, expiry |

## Coupon Codes

| Code | Type | Value | Minimum | Notes |
|------|------|-------|---------|-------|
| `WELCOME10` | Percentage | 10% | None | Max £500 discount, unlimited uses |
| `AUREM15` | Percentage | 15% | £1,000 | Max £800 discount, 200 uses |
| `GIFTED` | Fixed | £50 off | £300 | 100 uses |

## Deployment

1. Set `NODE_ENV=production` on the backend
2. Set `CLIENT_URL` to your live frontend domain
3. Use a **MongoDB Atlas** M10+ cluster
4. Configure **Cloudinary** for image hosting
5. Add your **Stripe** live keys to enable card payments
6. Point your **SMTP** credentials to a transactional email provider (Postmark, Resend, SendGrid)
7. Serve the backend with **PM2** or a similar process manager

```bash
# Example PM2 start
pm2 start backend/server.js --name aurem-api
```

## License

MIT
