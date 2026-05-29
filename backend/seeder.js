const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const Coupon = require('./models/Coupon');
const connectDB = require('./config/db');

const categoryData = [
  { name: 'Electronics', description: 'Gadgets and electronic devices' },
  { name: 'Clothing', description: 'Fashion and apparel' },
  { name: 'Books', description: 'Books and literature' },
  { name: 'Home & Garden', description: 'Home decor and garden supplies' },
  { name: 'Sports', description: 'Sports and outdoor equipment' },
];

const getProducts = (catMap) => [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for travel, work, or leisure.',
    shortDescription: 'Premium ANC headphones with 30-hour battery',
    price: 299.99, discountPrice: 249.99,
    category: catMap.electronics, brand: 'SoundPro', stock: 50, isFeatured: true,
    tags: ['headphones', 'wireless', 'noise-cancelling', 'bluetooth'],
    images: [{ public_id: 'demo1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' }],
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'Full-size mechanical keyboard with RGB backlighting, tactile switches, and anti-ghosting technology. Built for competitive gaming.',
    shortDescription: 'RGB mechanical keyboard for gaming',
    price: 149.99, discountPrice: 0,
    category: catMap.electronics, brand: 'GameTech', stock: 35, isFeatured: true,
    tags: ['keyboard', 'gaming', 'mechanical', 'rgb'],
    images: [{ public_id: 'demo2', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800' }],
  },
  {
    name: '4K Ultra HD Monitor 27"',
    description: '27-inch 4K IPS monitor with 144Hz refresh rate, HDR support, and USB-C connectivity.',
    shortDescription: '27" 4K 144Hz IPS monitor',
    price: 599.99, discountPrice: 499.99,
    category: catMap.electronics, brand: 'ViewTech', stock: 20, isFeatured: true,
    tags: ['monitor', '4k', 'gaming', 'ips'],
    images: [{ public_id: 'demo3', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800' }],
  },
  {
    name: 'Slim Fit Cotton T-Shirt',
    description: 'Premium 100% organic cotton slim fit t-shirt. Breathable, durable, and available in multiple colors.',
    shortDescription: 'Organic cotton slim fit tee',
    price: 29.99, discountPrice: 0,
    category: catMap.clothing, brand: 'PureWear', stock: 100, isFeatured: false,
    tags: ['tshirt', 'cotton', 'casual', 'slim-fit'],
    images: [{ public_id: 'demo4', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' }],
    variants: [
      { name: 'Size', value: 'S', stock: 25 }, { name: 'Size', value: 'M', stock: 40 },
      { name: 'Size', value: 'L', stock: 25 }, { name: 'Size', value: 'XL', stock: 10 },
    ],
  },
  {
    name: 'Running Sneakers Pro',
    description: 'Lightweight running shoes with advanced cushioning technology, breathable mesh upper, and durable rubber outsole.',
    shortDescription: 'Pro running shoes with advanced cushioning',
    price: 89.99, discountPrice: 74.99,
    category: catMap.sports, brand: 'RunFast', stock: 60, isFeatured: true,
    tags: ['shoes', 'running', 'sports', 'sneakers'],
    images: [{ public_id: 'demo5', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' }],
  },
  {
    name: 'JavaScript: The Definitive Guide',
    description: 'The comprehensive reference to JavaScript for web developers. Covers ES2023+ features, async programming, and modern patterns.',
    shortDescription: 'Complete JavaScript reference for developers',
    price: 59.99, discountPrice: 0,
    category: catMap.books, brand: "O'Reilly", stock: 40, isFeatured: false,
    tags: ['javascript', 'programming', 'web-development'],
    images: [{ public_id: 'demo6', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800' }],
  },
  {
    name: 'Scented Soy Candle Set',
    description: 'Set of 4 hand-poured soy wax candles in relaxing lavender, vanilla, eucalyptus, and sandalwood scents. 40-hour burn time each.',
    shortDescription: 'Set of 4 premium scented soy candles',
    price: 44.99, discountPrice: 34.99,
    category: catMap.homeGarden, brand: 'AromaHome', stock: 75, isFeatured: true,
    tags: ['candles', 'home-decor', 'scented', 'soy'],
    images: [{ public_id: 'demo7', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800' }],
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick 6mm non-slip yoga mat made from eco-friendly TPE material. Includes carry strap and alignment lines.',
    shortDescription: 'Eco-friendly non-slip 6mm yoga mat',
    price: 54.99, discountPrice: 44.99,
    category: catMap.sports, brand: 'ZenFit', stock: 45, isFeatured: false,
    tags: ['yoga', 'fitness', 'mat', 'sports'],
    images: [{ public_id: 'demo8', url: 'https://images.unsplash.com/photo-1601925228843-ff46eb85b7f5?w=800' }],
  },
  {
    name: 'Smart Home Security Camera',
    description: '1080p WiFi security camera with night vision, motion detection, two-way audio, and cloud storage.',
    shortDescription: '1080p WiFi camera with night vision',
    price: 79.99, discountPrice: 64.99,
    category: catMap.electronics, brand: 'SafeGuard', stock: 30, isFeatured: false,
    tags: ['camera', 'security', 'smart-home', 'wifi'],
    images: [{ public_id: 'demo9', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' }],
  },
  {
    name: 'Ceramic Plant Pot Set',
    description: 'Set of 3 minimalist ceramic plant pots with drainage holes and bamboo saucers. Perfect for succulents, cacti, and herbs.',
    shortDescription: 'Set of 3 minimalist ceramic planters',
    price: 39.99, discountPrice: 0,
    category: catMap.homeGarden, brand: 'GreenSpace', stock: 55, isFeatured: false,
    tags: ['plant-pot', 'ceramic', 'home-decor', 'garden'],
    images: [{ public_id: 'demo10', url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800' }],
  },
];

const couponsData = [
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, maxDiscountAmount: 50, usageLimit: 0, expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), isActive: true },
  { code: 'SAVE20', discountType: 'fixed', discountValue: 20, minOrderAmount: 100, maxDiscountAmount: 0, usageLimit: 100, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), isActive: true },
  { code: 'FLASH50', discountType: 'percentage', discountValue: 50, minOrderAmount: 200, maxDiscountAmount: 100, usageLimit: 50, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), isActive: true },
];

const importData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Promise.all([
      User.deleteMany(), Product.deleteMany(), Category.deleteMany(),
      Order.deleteMany(), Cart.deleteMany(), Coupon.deleteMany(),
    ]);

    // Drop stale slug index if it exists (prevents dup-index errors on re-seed)
    try {
      await mongoose.connection.collection('products').dropIndex('slug_1');
    } catch { /* index may not exist */ }

    // Create categories one-by-one so the pre-save slug hook fires
    const createdCats = [];
    for (const cat of categoryData) {
      createdCats.push(await new Category(cat).save());
    }

    const catMap = {
      electronics: createdCats.find((c) => c.name === 'Electronics')._id,
      clothing: createdCats.find((c) => c.name === 'Clothing')._id,
      books: createdCats.find((c) => c.name === 'Books')._id,
      homeGarden: createdCats.find((c) => c.name === 'Home & Garden')._id,
      sports: createdCats.find((c) => c.name === 'Sports')._id,
    };

    // Create products one-by-one so the pre-save slug hook fires
    for (const product of getProducts(catMap)) {
      await new Product(product).save();
    }

    // Create users
    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('user123', 12);

    await User.insertMany([
      { name: 'Admin User', email: 'admin@emarket.com', password: adminPassword, role: 'admin', isVerified: true },
      { name: 'John Doe', email: 'john@example.com', password: userPassword, role: 'customer', isVerified: true },
      { name: 'Jane Smith', email: 'jane@example.com', password: userPassword, role: 'customer', isVerified: true },
    ]);

    await Coupon.insertMany(couponsData);

    console.log('✅ Data imported successfully!\n');
    console.log('Admin   →  admin@emarket.com  /  admin123');
    console.log('Customer→  john@example.com   /  user123');
    process.exit();
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await Promise.all([
      User.deleteMany(), Product.deleteMany(), Category.deleteMany(),
      Order.deleteMany(), Cart.deleteMany(), Coupon.deleteMany(),
    ]);
    console.log('✅ Data destroyed!');
    process.exit();
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
