import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { StarDisplay } from '../ui/StarRating';
import { useAddToCartMutation } from '../../redux/api/cartApi';
import { useToggleWishlistMutation } from '../../redux/api/wishlistApi';
import { selectWishlistIds } from '../../redux/wishlistSlice';
import { selectIsLoggedIn } from '../../redux/authSlice';
import { openCart } from '../../redux/cartSlice';

export default function ProductCard({ product }) {
  const dispatch    = useDispatch();
  const isLoggedIn  = useSelector(selectIsLoggedIn);
  const wishlistIds = useSelector(selectWishlistIds);
  const isWishlisted = wishlistIds.includes(product._id);

  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
  const [toggleWishlist] = useToggleWishlistMutation();

  const image       = product.images?.[0]?.url;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const effectivePrice  = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { toast.error('Please sign in to add items to your bag.'); return; }
    try {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap();
      dispatch(openCart());
      toast.success('Added to your bag.');
    } catch (err) {
      toast.error(err?.data?.message || 'Could not add to bag.');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { toast.error('Please sign in to save items.'); return; }
    try { await toggleWishlist(product._id).unwrap(); } catch {}
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="card group block hover:border-primary-600/40 hover:shadow-sm transition-all duration-200"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-parchment">
        {image ? (
          <img
            src={image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-5xl text-sand-gold/50">A</span>
          </div>
        )}

        {/* Discount badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 badge-gold">−{discountPercent}%</span>
        )}

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-espresso/50 flex items-center justify-center">
            <span className="text-xs tracking-widest uppercase font-sans text-champagne border border-champagne/40 px-3 py-1.5">
              Sold
            </span>
          </div>
        )}

        {/* Last piece */}
        {product.stock > 0 && product.stock <= 3 && (
          <span className="absolute top-2 left-2 badge-claret">Last {product.stock}</span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 bg-champagne/90 border border-sand-gold/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-parchment"
          aria-label="Save to wishlist"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'text-claret fill-claret' : 'text-mid-gold'}`}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 border-t border-sand-gold/40">
        <p className="text-xs tracking-[0.18em] uppercase font-sans font-semibold text-mid-gold mb-1.5">
          {product.category?.name || product.brand}
        </p>
        <h3 className="font-display font-normal text-lg text-espresso leading-snug line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <StarDisplay rating={product.ratings} />
          <span className="text-xs font-sans text-mid-gold">({product.numReviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-sans font-semibold text-base text-primary-600 tracking-wide">
              {formatCurrency(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm font-sans text-mid-gold line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
            className="w-8 h-8 border border-primary-600 text-primary-600 flex items-center justify-center hover:bg-primary-600 hover:text-champagne transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </Link>
  );
}
