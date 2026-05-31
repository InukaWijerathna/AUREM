import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import logo from '../assets/logo.png';
import { Watch, Gem, Briefcase, Glasses, Sparkles, Gift } from 'lucide-react';
import { useGetFeaturedProductsQuery } from '../redux/api/productApi';
import { useGetCategoriesQuery } from '../redux/api/categoryApi';
import ProductGrid from '../components/products/ProductGrid';

const CATEGORY_ICONS = {
  timepieces:     Watch,
  jewellery:      Gem,
  'leather-goods': Briefcase,
  accessories:    Glasses,
  fragrance:      Sparkles,
  gifting:        Gift,
};

const PILLARS = [
  { title: 'Authenticated',  desc: 'Every piece verified by our in-house experts.' },
  { title: 'Discreet',       desc: 'Unmarked, insured delivery to your door.' },
  { title: 'Curated',        desc: 'A considered edit — nothing superfluous.' },
  { title: 'Timeless',       desc: 'Objects that outlast fashion.' },
];

export default function HomePage() {
  const { data: featuredData, isLoading } = useGetFeaturedProductsQuery();
  const { data: catData }                 = useGetCategoriesQuery();

  return (
    <>
      <Helmet>
        <title>AUREM — Curated Luxury</title>
        <meta name="description" content="A curated edit of the world's finest timepieces, jewellery, leather goods, accessories, fragrance and gifting." />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-champagne border-b border-sand-gold/40">
        <div className="container-custom pt-8 pb-24 md:pb-32 flex flex-col md:flex-row items-center gap-12">

          {/* Copy */}
          <div className="flex-1 space-y-8">
            <p className="sec-label">New Arrivals · Summer 2026</p>
            <h1 className="font-display font-light text-5xl md:text-7xl text-espresso leading-[1.05] tracking-wide">
              Objects of<br />
              <em className="italic-display text-primary-600">Enduring</em><br />
              Desire
            </h1>
            <p className="font-sans text-base text-mid-gold leading-relaxed max-w-sm">
              Rare timepieces, signed jewellery, and hand-crafted leather goods — sourced from the world's most celebrated ateliers.
            </p>
            <div className="flex items-center gap-4 flex-wrap pt-2">
              <Link to="/products" className="btn-primary">
                Explore Collection
              </Link>
              <Link to="/products?isFeatured=true" className="btn-secondary">
                Featured Pieces
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div className="hidden md:flex flex-col items-end gap-3 shrink-0 pr-8">
            <img src={logo} alt="AUREM" className="w-96 h-96 object-contain" />
            <p className="text-[8px] tracking-[0.28em] text-mid-gold uppercase font-sans">Curated Luxury · Est. 2024</p>
          </div>
        </div>
      </section>

      {/* ── Four pillars ──────────────────────────────────────────── */}
      <section className="bg-parchment border-b border-sand-gold/40">
        <div className="container-custom py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-sand-gold/40">
            {PILLARS.map(({ title, desc }) => (
              <div key={title} className="md:px-6 md:first:pl-0 md:last:pr-0 text-center md:text-left py-2 md:py-0">
                <p className="font-display text-base text-espresso mb-1">{title}</p>
                <p className="text-sm font-sans text-mid-gold leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by Category ──────────────────────────────────────── */}
      {catData?.categories?.length > 0 && (
        <section className="container-custom py-16">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="sec-label">Discover</p>
              <h2 className="font-display font-light text-3xl text-espresso tracking-wide">Shop by Category</h2>
            </div>
            <Link to="/products" className="text-xs tracking-wider uppercase text-primary-600 hover:text-primary-700 transition-colors font-sans font-semibold border-b border-primary-600 pb-px">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {catData.categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] || Gift;
              return (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat._id}`}
                  className="card p-5 text-center hover:border-primary-600/40 hover:shadow-sm transition-all group"
                >
                  {cat.image?.url ? (
                    <img src={cat.image.url} alt={cat.name} referrerPolicy="no-referrer" className="w-12 h-12 object-cover mx-auto mb-3 border border-sand-gold/40" />
                  ) : (
                    <div className="flex justify-center mb-3">
                      <Icon className="w-6 h-6 text-sand-gold group-hover:text-primary-600 transition-colors" strokeWidth={1} />
                    </div>
                  )}
                  <p className="text-xs tracking-wider uppercase font-sans font-medium text-espresso group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Featured Products ─────────────────────────────────────── */}
      <section className="bg-parchment border-y border-sand-gold/40 py-16">
        <div className="container-custom">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="sec-label">Handpicked</p>
              <h2 className="font-display font-light text-3xl text-espresso tracking-wide">Featured Pieces</h2>
            </div>
            <Link to="/products?isFeatured=true" className="text-xs tracking-wider uppercase text-primary-600 hover:text-primary-700 transition-colors font-sans font-semibold border-b border-primary-600 pb-px">
              View All
            </Link>
          </div>
          <ProductGrid products={featuredData?.products} isLoading={isLoading} count={8} />
        </div>
      </section>

      {/* ── Editorial banner ─────────────────────────────────────── */}
      <section className="container-custom py-16">
        <div className="bg-espresso border border-sand-gold/20 px-10 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="sec-label" style={{ color: '#A8926A' }}>Welcome Offer</p>
            <h3 className="font-display font-light text-3xl text-champagne leading-tight">
              Your First Acquisition
            </h3>
            <p className="font-sans text-base text-mid-gold mt-2">
              Use code <span className="text-primary-300 tracking-widest font-medium">WELCOME10</span> for 10% off your first order.
            </p>
          </div>
          <Link
            to="/products"
            className="btn-secondary shrink-0"
            style={{ borderColor: '#D9C89A', color: '#D9C89A' }}
          >
            Begin Exploring
          </Link>
        </div>
      </section>

      {/* ── Brand values strip ───────────────────────────────────── */}
      <section className="bg-parchment border-t border-sand-gold/40">
        <div className="container-custom py-8">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-3">
            {[
              'Certified Authentic',
              'Complimentary Gift Wrapping',
              'White-Glove Delivery',
              '30-Day Returns',
              'Lifetime Service',
            ].map((v) => (
              <span key={v} className="text-xs tracking-[0.15em] uppercase font-sans font-medium text-mid-gold flex items-center gap-2">
                <span className="text-sand-gold">—</span> {v}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
