import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/helpers';
import { StarDisplay } from '../ui/StarRating';
import { useAddToCartMutation } from '../../redux/api/cartApi';
import { useToggleWishlistMutation } from '../../redux/api/wishlistApi';
import { selectWishlistIds } from '../../redux/wishlistSlice';
import { selectIsLoggedIn } from '../../redux/authSlice';
import { openCart } from '../../redux/cartSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const wishlistIds = useSelector(selectWishlistIds);
  const isWishlisted = wishlistIds.includes(product._id);

  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
  const [toggleWishlist] = useToggleWishlistMutation();

  const image = product.images?.[0]?.url;
  const effectivePrice = product.discountPrice > 0 && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;
  const discountPercent = product.discountPrice > 0 && product.discountPrice < product.price
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap();
      dispatch(openCart());
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please login to save items');
      return;
    }
    try {
      await toggleWishlist(product._id).unwrap();
    } catch {}
  };

  return (
    <Link to={`/products/${product.slug}`} className="card group block hover:shadow-md transition-shadow duration-200">
      <div className="relative overflow-hidden rounded-t-xl aspect-square bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 badge bg-red-500 text-white">-{discountPercent}%</span>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-sm font-medium px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}

        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg
            className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <StarDisplay rating={product.ratings} />
          <span className="text-xs text-gray-500">({product.numReviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(effectivePrice)}</span>
            {discountPercent > 0 && (
              <span className="ml-2 text-sm text-gray-400 line-through">{formatCurrency(product.price)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
