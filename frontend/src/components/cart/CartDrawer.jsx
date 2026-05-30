import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import {
  selectCartIsOpen, closeCart,
  selectCartItems, selectCartSubtotal, selectCartItemCount,
} from '../../redux/cartSlice';
import { selectIsLoggedIn } from '../../redux/authSlice';
import {
  useGetCartQuery, useRemoveCartItemMutation, useUpdateCartItemMutation,
} from '../../redux/api/cartApi';
import { formatCurrency } from '../../utils/helpers';

export default function CartDrawer() {
  const dispatch   = useDispatch();
  const isOpen     = useSelector(selectCartIsOpen);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const cartItems  = useSelector(selectCartItems);
  const subtotal   = useSelector(selectCartSubtotal);
  const itemCount  = useSelector(selectCartItemCount);

  useGetCartQuery(undefined, { skip: !isLoggedIn });

  const [removeItem] = useRemoveCartItemMutation();
  const [updateItem] = useUpdateCartItemMutation();

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId).unwrap();
      toast.success('Item removed from bag.');
    } catch {
      toast.error('Could not remove item.');
    }
  };

  const handleQtyChange = async (productId, quantity, variant) => {
    if (quantity < 1) return;
    try {
      await updateItem({ productId, quantity, variant }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || 'Could not update quantity.');
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-espresso/40 z-40 backdrop-blur-sm"
          onClick={() => dispatch(closeCart())}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-champagne z-50 shadow-2xl flex flex-col transition-transform duration-300 border-l border-sand-gold/40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sand-gold/40">
          <div>
            <p className="sec-label mb-0">Your Bag</p>
            {itemCount > 0 && (
              <p className="text-xs font-sans text-mid-gold">{itemCount} {itemCount === 1 ? 'piece' : 'pieces'}</p>
            )}
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-2 text-mid-gold hover:text-espresso transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {!isLoggedIn ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-10 h-10 mx-auto text-sand-gold mb-4" strokeWidth={1} />
              <p className="text-sm font-sans font-light text-mid-gold mb-5">Sign in to view your bag.</p>
              <Link to="/login" onClick={() => dispatch(closeCart())} className="btn-primary">
                Sign In
              </Link>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-10 h-10 mx-auto text-sand-gold mb-4" strokeWidth={1} />
              <p className="text-sm font-sans font-light text-mid-gold mb-2">Your bag is empty.</p>
              <p className="text-xs font-sans text-mid-gold/60 mb-5">Discover pieces you'll treasure.</p>
              <Link to="/products" onClick={() => dispatch(closeCart())} className="btn-primary">
                Explore Collection
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.product?._id}-${JSON.stringify(item.variant)}`}
                className="flex gap-4 pb-5 border-b border-sand-gold/30 last:border-0 last:pb-0"
              >
                {/* Image */}
                <Link
                  to={`/products/${item.product?.slug}`}
                  onClick={() => dispatch(closeCart())}
                  className="shrink-0"
                >
                  {item.product?.images?.[0]?.url ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product?.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-24 object-cover border border-sand-gold/40 bg-parchment"
                    />
                  ) : (
                    <div className="w-20 h-24 bg-parchment border border-sand-gold/40 flex items-center justify-center">
                      <span className="font-display text-2xl text-sand-gold/60">A</span>
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs tracking-[0.15em] uppercase font-sans font-semibold text-mid-gold mb-1">
                    {item.product?.category?.name || item.product?.brand}
                  </p>
                  <Link
                    to={`/products/${item.product?.slug}`}
                    onClick={() => dispatch(closeCart())}
                  >
                    <p className="font-display font-light text-sm text-espresso leading-snug line-clamp-2 hover:text-primary-600 transition-colors">
                      {item.product?.name}
                    </p>
                  </Link>
                  {item.variant && (
                    <p className="text-xs font-sans text-mid-gold mt-0.5">
                      {item.variant.name}: {item.variant.value}
                    </p>
                  )}
                  <p className="text-sm font-sans font-semibold text-primary-600 mt-1.5">
                    {formatCurrency(item.price)}
                  </p>

                  {/* Qty + remove */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-sand-gold/60">
                      <button
                        onClick={() => handleQtyChange(item.product?._id, item.quantity - 1, item.variant)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 flex items-center justify-center text-mid-gold hover:text-espresso hover:bg-sand-gold/20 transition-colors disabled:opacity-30"
                      >
                        <Minus className="w-3 h-3" strokeWidth={1.5} />
                      </button>
                      <span className="w-8 text-center text-xs font-sans text-espresso">{item.quantity}</span>
                      <button
                        onClick={() => handleQtyChange(item.product?._id, item.quantity + 1, item.variant)}
                        className="w-7 h-7 flex items-center justify-center text-mid-gold hover:text-espresso hover:bg-sand-gold/20 transition-colors"
                      >
                        <Plus className="w-3 h-3" strokeWidth={1.5} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.product?._id)}
                      className="p-1.5 text-mid-gold hover:text-claret transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {isLoggedIn && cartItems.length > 0 && (
          <div className="border-t border-sand-gold/40 px-6 py-5 space-y-4 bg-parchment">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-sans font-semibold text-mid-gold">Subtotal</span>
              <span className="font-sans text-sm text-primary-600 tracking-wide">{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-xs font-sans text-mid-gold">
              Shipping and duties calculated at checkout.
            </p>
            <div className="flex gap-3">
              <Link
                to="/cart"
                onClick={() => dispatch(closeCart())}
                className="btn-secondary flex-1 text-center"
              >
                View Bag
              </Link>
              <Link
                to="/checkout"
                onClick={() => dispatch(closeCart())}
                className="btn-primary flex-1 text-center"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
