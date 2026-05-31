import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useGetProductBySlugQuery } from '../redux/api/productApi';
import { useAddToCartMutation } from '../redux/api/cartApi';
import { useToggleWishlistMutation } from '../redux/api/wishlistApi';
import { selectIsLoggedIn } from '../redux/authSlice';
import { selectWishlistIds } from '../redux/wishlistSlice';
import { openCart } from '../redux/cartSlice';
import { formatCurrency, formatDate, addToRecentlyViewed } from '../utils/helpers';
import ImageGallery from '../components/products/ImageGallery';
import { StarDisplay } from '../components/ui/StarRating';
import ReviewForm from '../components/products/ReviewForm';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Loader from '../components/ui/Loader';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const wishlistIds = useSelector(selectWishlistIds);

  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  const { data, isLoading, refetch } = useGetProductBySlugQuery(slug);
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
  const [toggleWishlist] = useToggleWishlistMutation();

  const product = data?.product;
  const isWishlisted = product && wishlistIds.includes(product._id);

  useEffect(() => {
    if (product) addToRecentlyViewed(product);
  }, [product]);

  const effectivePrice = product?.discountPrice > 0 && product?.discountPrice < product?.price
    ? product.discountPrice
    : product?.price;

  const discountPercent = product?.discountPrice > 0 && product?.discountPrice < product?.price
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart({ productId: product._id, quantity: qty, variant: selectedVariant }).unwrap();
      dispatch(openCart());
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to save items');
      return;
    }
    await toggleWishlist(product._id);
  };

  if (isLoading) return <div className="container-custom py-12"><Loader text="Loading product..." /></div>;
  if (!product) return <div className="container-custom py-12 text-center text-gray-500">Product not found.</div>;

  const groupedVariants = product.variants?.reduce((acc, v) => {
    if (!acc[v.name]) acc[v.name] = [];
    acc[v.name].push(v);
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>{product.name} — AUREM</title>
        <meta name="description" content={product.shortDescription || product.description?.substring(0, 160)} />
      </Helmet>

      <div className="container-custom py-8">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.category?.name, href: `/products?category=${product.category?._id}` },
          { label: product.name },
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <ImageGallery images={product.images} name={product.name} />

          {/* Info */}
          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <StarDisplay rating={product.ratings} size="md" />
              <span className="text-sm text-gray-500">{product.numReviews} reviews</span>
              {product.soldCount > 0 && (
                <span className="text-sm text-gray-400">· {product.soldCount} sold</span>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-bold text-gray-900">{formatCurrency(effectivePrice)}</span>
              {discountPercent > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatCurrency(product.price)}</span>
                  <span className="badge bg-red-100 text-red-700 text-sm">-{discountPercent}%</span>
                </>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-gray-600">{product.shortDescription}</p>
            )}

            {/* Variants */}
            {groupedVariants && Object.keys(groupedVariants).map((varName) => (
              <div key={varName}>
                <p className="text-sm font-medium text-gray-700 mb-2">{varName}:</p>
                <div className="flex flex-wrap gap-2">
                  {groupedVariants[varName].map((v) => (
                    <button
                      key={v.value}
                      onClick={() => setSelectedVariant({ name: v.name, value: v.value })}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedVariant?.value === v.value
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      } ${v.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                      disabled={v.stock === 0}
                    >
                      {v.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Quantity:</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                  </button>
                  <span className="px-4 py-2 font-medium">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
                <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="btn-primary flex-1 py-3 text-base"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlist}
                className={`p-3 rounded-lg border transition-colors ${isWishlisted ? 'border-red-400 bg-red-50 text-red-500' : 'border-gray-300 hover:border-red-400 hover:text-red-500'}`}
              >
                <svg className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Link key={tag} to={`/products?keyword=${tag}`} className="badge bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200 flex gap-8">
            {['description', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab} {tab === 'reviews' && `(${product.numReviews})`}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-gray-600 leading-relaxed">
                {product.description}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {product.reviews?.length === 0 && (
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                )}
                {product.reviews?.map((review) => (
                  <div key={review._id} className="card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{review.name}</span>
                          <StarDisplay rating={review.rating} />
                        </div>
                        <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                        <p className="text-gray-600 mt-2">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoggedIn && (
                  <div className="card p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
                    <ReviewForm productId={product._id} onSuccess={refetch} />
                  </div>
                )}
                {!isLoggedIn && (
                  <p className="text-gray-500">
                    <Link to="/login" className="text-primary-600 hover:underline">Login</Link> to write a review.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
