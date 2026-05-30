# AUREM | Curated Luxury E-Commerce

![Banner](https://img.shields.io/badge/AUREM-Curated_Luxury-7A5C28?style=for-the-badge&logo=shopify&logoColor=F5EDD8)

**AUREM** is a full-stack luxury e-commerce platform for curated high-end goods across six categories — Timepieces, Jewellery, Leather Goods, Accessories, Fragrance, and Gifting. Built with a MERN stack and deployed on Vercel.

## 🔑 Demo Credentials

Try the live store at [https://aurem-store.vercel.app](https://aurem-store.vercel.app)

### Admin
| Field | Value |
|-------|-------|
| Email | `admin@aurem.com` |
| Password | `admin123` |

**Admin can:**
- Manage products, categories, orders, users, and coupons
- View revenue charts, top products, and KPIs on the dashboard
- Upload product images, update order status with tracking numbers

### Customer
| Field | Value |
|-------|-------|
| Email | `isabelle@example.com` |
| Password | `user123` |

**Customer can:**
- Browse and filter the collection by category, price, and rating
- Add to bag, apply coupon codes, and checkout
- Track orders, manage wishlist and saved addresses

### Coupon Codes
| Code | Type | Value |
|------|------|-------|
| `WELCOME10` | Percentage | 10% off — no minimum |
| `AUREM15` | Percentage | 15% off orders over £1,000 |
| `GIFTED` | Fixed | £50 off orders over £300 |

---

## 🛍️ Core Features

- **Authentication** — JWT access + refresh tokens via httpOnly cookies, email verification, OTP password reset
- **Product Catalogue** — Search, filter by category / price / rating / stock, variants, reviews, featured flag
- **Cart & Checkout** — Persistent server-side cart, coupon codes, COD + Stripe payments
- **Order Pipeline** — Status tracking (pending → shipped → delivered), email notifications, tracking numbers
- **Wishlist** — Toggle save with optimistic UI
- **Admin Panel** — Revenue charts (Recharts), full CRUD for products, orders, users, categories, coupons
- **Image Uploads** — Cloudinary via Multer (falls back to local disk when unconfigured)
- **Emails** — Nodemailer HTML templates for order confirmation, shipping updates, password reset

## 🎨 Brand Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Champagne | `#F5EDD8` | Page background |
| Parchment | `#EDE0C4` | Cards, navbar, surfaces |
| Sand Gold | `#D9C89A` | Borders, dividers |
| Deep Gold | `#7A5C28` | Logo, CTAs, prices |
| Espresso | `#2C2418` | Primary text, footer |
| Claret | `#6B1F1F` | Alerts, "last piece" badges |

**Typography:** Cormorant Garamond (display) + Montserrat (body)

## 🚀 Deployment

Both services are deployed on **Vercel** with auto-deploy on every push to `main`.

| Service | URL |
|---------|-----|
| Frontend | [https://aurem-store.vercel.app](https://aurem-store.vercel.app) |
| Backend API | [https://aurem-backend.vercel.app](https://aurem-backend.vercel.app) |

- **Database** — MongoDB Atlas
- **Images** — Cloudinary
- **Payments** — Stripe

---

## 🛠️ Tech Stack

- **Frontend** — React 18, Redux Toolkit + RTK Query, React Router v6, Tailwind CSS, Lucide React
- **Backend** — Node.js, Express.js, Mongoose
- **Database** — MongoDB Atlas
- **Auth** — JWT (httpOnly cookies), bcryptjs
- **Payments** — Stripe
- **Uploads** — Multer + Cloudinary
- **Email** — Nodemailer

## ⚡ Quick Start

### Prerequisites
- Node.js v20+
- MongoDB Atlas URI

### Installation
```bash
git clone https://github.com/InukaWijerathna/AUREM.git
cd AUREM
npm run install:all
```

### Configuration
```bash
cp .env.example backend/.env
# Fill in MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, CLIENT_URL
```

### Seed the database
```bash
npm run seed
```

### Run in development
```bash
npm run dev
```

- Frontend → `http://localhost:5173`
- Backend → `http://localhost:5000`

---

## 📄 License
MIT
