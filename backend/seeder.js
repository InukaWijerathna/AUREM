const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User     = require('./models/User');
const Product  = require('./models/Product');
const Category = require('./models/Category');
const Order    = require('./models/Order');
const Cart     = require('./models/Cart');
const Coupon   = require('./models/Coupon');
const connectDB = require('./config/db');

// ── Categories ───────────────────────────────────────────────────────────────
const categoryData = [
  { name: 'Timepieces',    description: 'Mechanical and quartz watches from the world\'s finest ateliers.' },
  { name: 'Jewellery',     description: 'Fine jewellery in gold, platinum, and precious stones.' },
  { name: 'Leather Goods', description: 'Hand-crafted bags, wallets, and small leather accessories.' },
  { name: 'Accessories',   description: 'Scarves, pocket squares, belts, and curated finishing pieces.' },
  { name: 'Fragrance',     description: 'Rare and signature perfumes from independent and heritage houses.' },
  { name: 'Gifting',       description: 'Considered gift sets and bespoke wrapped pieces for every occasion.' },
];

// ── Products ─────────────────────────────────────────────────────────────────
const getProducts = (c) => [

  // ── Timepieces (2) ─────────────────────────────────────────────────────────
  {
    name: 'Atelier No.1 — Grand Complication',
    shortDescription: 'Swiss automatic, 42mm rose gold case, sapphire exhibition back',
    description: 'A masterwork of horological engineering, the Grand Complication houses a hand-wound movement with perpetual calendar, moon-phase, and minute repeater complications. The 42mm 18k rose-gold case is paired with an alligator strap hand-stitched in our Geneva workshop. Limited to 50 numbered pieces annually.',
    price: 14800,
    discountPrice: 0,
    category: c.timepieces,
    brand: 'Atelier Horlogère',
    stock: 4,
    isFeatured: true,
    tags: ['watch', 'automatic', 'rose-gold', 'limited-edition', 'complication'],
    images: [{ public_id: 'tp_001', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    name: 'Classique Dresswatch — Steel',
    shortDescription: '38mm steel dress watch, hand-wound movement, silver dial',
    description: 'Distilled elegance. The Classique pairs a 38mm polished steel case with a silver guilloché dial and a slim hand-wound caliber visible through the exhibition caseback. A piece that wears as naturally with evening dress as it does with a morning suit.',
    price: 3950,
    discountPrice: 3500,
    category: c.timepieces,
    brand: 'Atelier Horlogère',
    stock: 12,
    isFeatured: true,
    tags: ['watch', 'dress-watch', 'steel', 'hand-wound', 'classic'],
    images: [{ public_id: 'tp_002', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80' }],
    variants: [
      { name: 'Strap', value: 'Black Alligator', stock: 6 },
      { name: 'Strap', value: 'Tan Calfskin',    stock: 6 },
    ],
  },

  // ── Jewellery (3) ──────────────────────────────────────────────────────────
  {
    name: 'Lumière Diamond Rivière Bracelet',
    shortDescription: '18k white gold, 7.2ct total weight, D-F VS diamonds',
    description: 'Forty-two round-brilliant diamonds, each hand-selected for colour and clarity, are set in individually articulated 18k white-gold links. The result moves like water on the wrist. Accompanied by a gemological certificate from an independent laboratory.',
    price: 18500,
    discountPrice: 0,
    category: c.jewellery,
    brand: 'Maison AUREM',
    stock: 3,
    isFeatured: true,
    tags: ['bracelet', 'diamond', 'white-gold', 'riviere', 'certified'],
    images: [{ public_id: 'jw_001', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    name: 'Perle Baroque Drop Earrings',
    shortDescription: 'South Sea baroque pearls, 18k yellow gold settings',
    description: 'Two naturally-formed South Sea baroque pearls — each unique in form — suspended from hand-fabricated 18k yellow-gold ear wires. The irregular surface catches light in ways no perfectly round pearl can. Supplied in an AUREM keepsake box with care card.',
    price: 2800,
    discountPrice: 2400,
    category: c.jewellery,
    brand: 'Maison AUREM',
    stock: 8,
    isFeatured: true,
    tags: ['earrings', 'pearl', 'baroque', 'yellow-gold', 'south-sea'],
    images: [{ public_id: 'jw_002', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    name: 'Signet Ring — Heavy Gold',
    shortDescription: '18k yellow gold, hand-engraved, 12mm face',
    description: 'Cast from solid 18k yellow gold and finished entirely by hand, this signet carries a 12mm oval face ready for engraving with an initial, crest, or custom motif — a service included with purchase. A piece designed to be worn daily and passed down across generations.',
    price: 4200,
    discountPrice: 0,
    category: c.jewellery,
    brand: 'Maison AUREM',
    stock: 6,
    isFeatured: false,
    tags: ['ring', 'signet', 'gold', 'engraving', 'heirloom'],
    images: [{ public_id: 'jw_003', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80' }],
    variants: [
      { name: 'Size', value: 'N (EU 54)', stock: 2 },
      { name: 'Size', value: 'P (EU 57)', stock: 2 },
      { name: 'Size', value: 'R (EU 60)', stock: 2 },
    ],
  },

  // ── Leather Goods (2) ──────────────────────────────────────────────────────
  {
    name: 'Grand Folio Briefcase',
    shortDescription: 'Full-grain saddle-tan calfskin, brass hardware, 15" laptop sleeve',
    description: 'Hand-assembled in our Florentine workshop from a single hide of full-grain calfskin, the Grand Folio develops a rich patina with age. It holds a 15-inch laptop in a felt-lined sleeve, with two document compartments and a zipped interior pocket. Brass fittings age to a warm antique finish. Monogramming available.',
    price: 2650,
    discountPrice: 0,
    category: c.leatherGoods,
    brand: 'Bottega Firenze',
    stock: 9,
    isFeatured: true,
    tags: ['briefcase', 'leather', 'calfskin', 'laptop-bag', 'handmade'],
    images: [{ public_id: 'lg_001', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' }],
    variants: [
      { name: 'Colour', value: 'Saddle Tan', stock: 5 },
      { name: 'Colour', value: 'Midnight Navy', stock: 4 },
    ],
  },
  {
    name: 'Slim Card Compendium',
    shortDescription: 'Vegetable-tanned leather, 6-card slots, coin pocket',
    description: 'A minimalist wallet for those who carry only what they need. Six card slots and a flat coin pocket are cut from vegetable-tanned leather and hand-burnished at the edges. The natural tanning process means each wallet will age uniquely. Fits in a breast or trouser pocket without bulk.',
    price: 285,
    discountPrice: 0,
    category: c.leatherGoods,
    brand: 'Bottega Firenze',
    stock: 30,
    isFeatured: false,
    tags: ['wallet', 'cardholder', 'vegetable-tanned', 'slim', 'handmade'],
    images: [{ public_id: 'lg_002', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' }],
    variants: [
      { name: 'Colour', value: 'Natural Tan', stock: 10 },
      { name: 'Colour', value: 'Dark Chocolate', stock: 10 },
      { name: 'Colour', value: 'Slate Grey', stock: 10 },
    ],
  },

  // ── Accessories (2) ────────────────────────────────────────────────────────
  {
    name: 'Cashmere Travel Wrap',
    shortDescription: 'Grade A inner-Mongolian cashmere, 140×200cm, herringbone weave',
    description: 'Woven from grade-A long-staple cashmere sourced from the Alxa plateau of Inner Mongolia, this oversized wrap functions as scarf, blanket, and shoulder throw. The herringbone structure provides warmth without weight. Presented in a cotton drawstring bag for travel.',
    price: 580,
    discountPrice: 480,
    category: c.accessories,
    brand: 'Plaid Nordique',
    stock: 20,
    isFeatured: true,
    tags: ['cashmere', 'scarf', 'wrap', 'travel', 'herringbone'],
    images: [{ public_id: 'ac_001', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80' }],
    variants: [
      { name: 'Colour', value: 'Camel',      stock: 7 },
      { name: 'Colour', value: 'Ivory',       stock: 7 },
      { name: 'Colour', value: 'Charcoal',    stock: 6 },
    ],
  },
  {
    name: 'Hand-Rolled Silk Pocket Square',
    shortDescription: '100% Lyons silk, 33×33cm, hand-rolled and hand-stitched edges',
    description: 'Printed in Lyon on 16mm pure silk twill, then hand-rolled and hem-stitched by artisans in our Paris atelier. Each colourway is a limited print run of 200 pieces. The precise roll of the hem is the mark of quality that separates a true pocket square from a cut piece of fabric.',
    price: 165,
    discountPrice: 0,
    category: c.accessories,
    brand: 'Soierie Lyon',
    stock: 40,
    isFeatured: false,
    tags: ['pocket-square', 'silk', 'lyons', 'hand-rolled', 'accessories'],
    images: [{ public_id: 'ac_002', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' }],
    variants: [
      { name: 'Pattern', value: 'Auric Paisley',  stock: 15 },
      { name: 'Pattern', value: 'Midnight Foulard', stock: 15 },
      { name: 'Pattern', value: 'Ivory Geometric', stock: 10 },
    ],
  },

  // ── Fragrance (2) ──────────────────────────────────────────────────────────
  {
    name: 'Oud Impérial — Extrait de Parfum',
    shortDescription: 'Cambodian agarwood, rose absolue, amber, 50ml',
    description: 'Blended by a fifth-generation perfumer in Grasse, Oud Impérial opens with the dry, almost smoky facets of aged Cambodian agarwood, then settles into Bulgarian rose absolue and warm Omani amber. Sillage is remarkable without being intrusive. 50ml blown-glass flacon with 18k gold-plated cap.',
    price: 420,
    discountPrice: 0,
    category: c.fragrance,
    brand: 'Parfumerie Grasse',
    stock: 18,
    isFeatured: true,
    tags: ['oud', 'extrait', 'rose', 'amber', 'niche-fragrance'],
    images: [{ public_id: 'fr_001', url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=800&q=80' }],
    variants: [
      { name: 'Size', value: '50ml',  stock: 12 },
      { name: 'Size', value: '100ml', stock: 6, priceAdjustment: 180 },
    ],
  },
  {
    name: 'Fleur Blanche — Eau de Parfum',
    shortDescription: 'Jasmine sambac, tuberose, musk, 75ml, gender-neutral',
    description: 'An opulent white floral built on jasmine sambac absolute and Egyptian tuberose, grounded by a clean musky base. Neither overtly feminine nor masculine — a statement of confidence on any wearer. The octagonal crystal flacon is designed to display as beautifully as the scent performs.',
    price: 265,
    discountPrice: 225,
    category: c.fragrance,
    brand: 'Parfumerie Grasse',
    stock: 22,
    isFeatured: false,
    tags: ['jasmine', 'tuberose', 'musk', 'white-floral', 'unisex'],
    images: [{ public_id: 'fr_002', url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80' }],
    variants: [
      { name: 'Size', value: '30ml',  stock: 8, priceAdjustment: -80 },
      { name: 'Size', value: '75ml',  stock: 14 },
    ],
  },

  // ── Gifting (2) ────────────────────────────────────────────────────────────
  {
    name: 'The Connoisseur Gift Set',
    shortDescription: 'Curated triad: silk pocket square, card compendium, fragrance sample set',
    description: 'For the person who has everything — a thoughtfully assembled triad of objects from three of our finest houses. Contents: one hand-rolled Soierie Lyon pocket square, one slim vegetable-tanned card compendium, and a fragrance discovery set of five 5ml decants from Parfumerie Grasse. Presented in a cloth-covered gift box with hand-written card service.',
    price: 480,
    discountPrice: 420,
    category: c.gifting,
    brand: 'AUREM Gifting',
    stock: 15,
    isFeatured: true,
    tags: ['gift-set', 'curated', 'luxury-gift', 'pocket-square', 'fragrance'],
    images: [{ public_id: 'gi_001', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    name: 'Bespoke Gift Wrapping Service',
    shortDescription: 'Hand-wrapped in AUREM house paper, wax seal, personal card, ribbon',
    description: 'Elevate any AUREM purchase with our signature wrapping service. Your piece is dressed in champagne-coloured tissue, wrapped in our embossed house paper, sealed with an AUREM wax medallion in deep gold, finished with silk ribbon, and accompanied by a hand-calligraphed card. Indicate your message at checkout.',
    price: 45,
    discountPrice: 0,
    category: c.gifting,
    brand: 'AUREM Gifting',
    stock: 999,
    isFeatured: false,
    tags: ['gift-wrap', 'service', 'wax-seal', 'presentation', 'bespoke'],
    images: [{ public_id: 'gi_002', url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80' }],
  },
];

// ── Coupons ──────────────────────────────────────────────────────────────────
const couponsData = [
  {
    code: 'WELCOME10',
    discountType: 'percentage', discountValue: 10,
    minOrderAmount: 0, maxDiscountAmount: 500,
    usageLimit: 0,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    code: 'AUREM15',
    discountType: 'percentage', discountValue: 15,
    minOrderAmount: 1000, maxDiscountAmount: 800,
    usageLimit: 200,
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    code: 'GIFTED',
    discountType: 'fixed', discountValue: 50,
    minOrderAmount: 300, maxDiscountAmount: 0,
    usageLimit: 100,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
];

// ── Seed ─────────────────────────────────────────────────────────────────────
const importData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Promise.all([
      User.deleteMany(), Product.deleteMany(), Category.deleteMany(),
      Order.deleteMany(), Cart.deleteMany(), Coupon.deleteMany(),
    ]);

    // Drop stale slug indexes (prevents dup-index errors on re-seed)
    try { await mongoose.connection.collection('products').dropIndex('slug_1'); }   catch {}
    try { await mongoose.connection.collection('categories').dropIndex('slug_1'); } catch {}

    // Categories — one-by-one so pre-save slug hook fires
    const createdCats = [];
    for (const cat of categoryData) {
      createdCats.push(await new Category(cat).save());
    }

    const find = (name) => createdCats.find((c) => c.name === name)._id;
    const c = {
      timepieces:   find('Timepieces'),
      jewellery:    find('Jewellery'),
      leatherGoods: find('Leather Goods'),
      accessories:  find('Accessories'),
      fragrance:    find('Fragrance'),
      gifting:      find('Gifting'),
    };

    // Products — one-by-one so pre-save slug hook fires
    for (const product of getProducts(c)) {
      await new Product(product).save();
    }

    // Users
    const adminPw    = await bcrypt.hash('admin123', 12);
    const customerPw = await bcrypt.hash('user123', 12);

    await User.insertMany([
      { name: 'AUREM Admin',  email: 'admin@aurem.com',  password: adminPw,    role: 'admin',    isVerified: true },
      { name: 'Isabelle Chen', email: 'isabelle@example.com', password: customerPw, role: 'customer', isVerified: true },
      { name: 'Marcus Webb',  email: 'marcus@example.com', password: customerPw, role: 'customer', isVerified: true },
    ]);

    await Coupon.insertMany(couponsData);

    console.log('\n✅  AUREM seed data imported successfully.\n');
    console.log('─────────────────────────────────────────');
    console.log('  Admin     →  admin@aurem.com   /  admin123');
    console.log('  Customer  →  isabelle@example.com  /  user123');
    console.log('─────────────────────────────────────────');
    console.log('\n  Coupons:  WELCOME10 · AUREM15 · GIFTED\n');
    process.exit();
  } catch (err) {
    console.error(`\n❌  ${err.message}\n`);
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
    console.log('✅  All data destroyed.');
    process.exit();
  } catch (err) {
    console.error(`❌  ${err.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
