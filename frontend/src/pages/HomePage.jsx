import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGetFeaturedProductsQuery } from '../redux/api/productApi';
import { useGetCategoriesQuery } from '../redux/api/categoryApi';
import ProductGrid from '../components/products/ProductGrid';

const HERO_FEATURES = [
  { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $100' },
  { icon: '🔒', title: 'Secure Payments', desc: 'SSL encrypted checkout' },
  { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
  { icon: '🎧', title: '24/7 Support', desc: 'We\'re here to help' },
];

export default function HomePage() {
  const { data: featuredData, isLoading } = useGetFeaturedProductsQuery();
  const { data: catData } = useGetCategoriesQuery();

  return (
    <>
      <Helmet>
        <title>EMarket – Shop Electronics, Clothing, Books & More</title>
        <meta name="description" content="Discover thousands of products at great prices. Shop electronics, clothing, books, home goods and more." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Shop Smarter,<br />
              <span className="text-primary-200">Live Better</span>
            </h1>
            <p className="text-primary-100 text-lg max-w-md">
              Discover thousands of products across electronics, fashion, books, and more. Quality guaranteed.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/products" className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors">
                Shop Now
              </Link>
              <Link to="/products?isFeatured=true" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary-700 transition-colors">
                Featured Deals
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm text-primary-200">
              <span>✓ 10,000+ products</span>
              <span>✓ Fast delivery</span>
              <span>✓ Trusted by 50k+ customers</span>
            </div>
          </div>
          <div className="hidden md:block flex-1 text-center">
            <div className="text-8xl">🛍️</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {HERO_FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <span className="text-3xl">{f.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
                  <p className="text-gray-500 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {catData?.categories?.length > 0 && (
        <section className="container-custom py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <Link to="/products" className="text-primary-600 text-sm font-medium hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {catData.categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="card p-4 text-center hover:shadow-md hover:border-primary-200 border border-transparent transition-all group"
              >
                {cat.image?.url ? (
                  <img src={cat.image.url} alt={cat.name} className="w-16 h-16 object-cover rounded-lg mx-auto mb-3" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center mx-auto mb-3 text-2xl">
                    🏷️
                  </div>
                )}
                <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="container-custom py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products?isFeatured=true" className="text-primary-600 text-sm font-medium hover:underline">View all</Link>
        </div>
        <ProductGrid products={featuredData?.products} isLoading={isLoading} count={8} />
      </section>

      {/* Promo Banner */}
      <section className="container-custom py-8">
        <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">First Order Discount!</h3>
            <p className="text-orange-100">Use code <strong>WELCOME10</strong> for 10% off your first purchase</p>
          </div>
          <Link to="/products" className="bg-white text-orange-500 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors shrink-0">
            Shop Now
          </Link>
        </div>
      </section>
    </>
  );
}
