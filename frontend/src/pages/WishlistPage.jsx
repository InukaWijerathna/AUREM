import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../redux/api/wishlistApi';
import { useAddToCartMutation } from '../redux/api/cartApi';
import { openCart } from '../redux/cartSlice';
import { formatCurrency } from '../utils/helpers';
import { StarDisplay } from '../components/ui/StarRating';
import Loader from '../components/ui/Loader';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();

  const handleMoveToCart = async (product) => {
    try {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap();
      await removeFromWishlist(product._id).unwrap();
      dispatch(openCart());
      toast.success('Moved to cart!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to move to cart');
    }
  };

  const wishlist = data?.wishlist || [];

  return (
    <>
      <Helmet><title>Wishlist – EMarket</title></Helmet>
      <div className="container-custom py-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]} />
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          My Wishlist {wishlist.length > 0 && <span className="text-gray-400 font-normal text-lg">({wishlist.length})</span>}
        </h1>

        {isLoading ? (
          <Loader text="Loading wishlist..." />
        ) : wishlist.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-500 mb-4">Your wishlist is empty</p>
            <Link to="/products" className="btn-primary px-8 py-3">Discover Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => {
              const price = product.discountPrice > 0 && product.discountPrice < product.price
                ? product.discountPrice : product.price;
              return (
                <div key={product._id} className="card group">
                  <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100">
                    <Link to={`/products/${product.slug}`}>
                      <img src={product.images?.[0]?.url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm text-red-500 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <Link to={`/products/${product.slug}`} className="font-medium text-gray-900 line-clamp-2 hover:text-primary-600 text-sm">{product.name}</Link>
                    <div className="flex items-center gap-1 mt-1 mb-3">
                      <StarDisplay rating={product.ratings} />
                      <span className="text-xs text-gray-400">({product.numReviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{formatCurrency(price)}</span>
                      <button
                        onClick={() => handleMoveToCart(product)}
                        disabled={product.stock === 0 || addingToCart}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
