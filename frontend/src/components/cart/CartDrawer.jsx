import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { selectCartIsOpen, closeCart, selectCartItems, selectCartSubtotal, selectCartItemCount } from '../../redux/cartSlice';
import { selectIsLoggedIn } from '../../redux/authSlice';
import { useGetCartQuery, useRemoveCartItemMutation, useUpdateCartItemMutation } from '../../redux/api/cartApi';
import { formatCurrency } from '../../utils/helpers';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectCartIsOpen);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const itemCount = useSelector(selectCartItemCount);

  useGetCartQuery(undefined, { skip: !isLoggedIn });

  const [removeItem] = useRemoveCartItemMutation();
  const [updateItem] = useUpdateCartItemMutation();

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId).unwrap();
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleQtyChange = async (productId, quantity, variant) => {
    if (quantity < 1) return;
    try {
      await updateItem({ productId, quantity, variant }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update quantity');
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => dispatch(closeCart())} />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold">
            Cart {itemCount > 0 && <span className="text-primary-600">({itemCount})</span>}
          </h2>
          <button onClick={() => dispatch(closeCart())} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!isLoggedIn ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Login to view your cart</p>
              <Link to="/login" onClick={() => dispatch(closeCart())} className="btn-primary">Login</Link>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-500">Your cart is empty</p>
              <Link to="/products" onClick={() => dispatch(closeCart())} className="btn-primary mt-4 inline-block">Shop Now</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.product?._id}-${JSON.stringify(item.variant)}`} className="flex gap-3">
                <Link to={`/products/${item.product?.slug}`} onClick={() => dispatch(closeCart())}>
                  <img
                    src={item.product?.images?.[0]?.url}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-100 shrink-0"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product?.slug}`} onClick={() => dispatch(closeCart())}>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary-600">
                      {item.product?.name}
                    </p>
                  </Link>
                  {item.variant && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.variant.name}: {item.variant.value}</p>
                  )}
                  <p className="text-sm font-bold text-primary-600 mt-1">{formatCurrency(item.price)}</p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => handleQtyChange(item.product?._id, item.quantity - 1, item.variant)}
                        className="px-2 py-1 hover:bg-gray-50 text-gray-600 rounded-l-lg"
                        disabled={item.quantity <= 1}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                      </button>
                      <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQtyChange(item.product?._id, item.quantity + 1, item.variant)}
                        className="px-2 py-1 hover:bg-gray-50 text-gray-600 rounded-r-lg"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                    <button onClick={() => handleRemove(item.product?._id)} className="text-red-500 hover:text-red-700 p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {isLoggedIn && cartItems.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-500">Shipping and taxes calculated at checkout</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={() => dispatch(closeCart())}
                className="btn-secondary text-sm text-center"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={() => dispatch(closeCart())}
                className="btn-primary text-sm text-center"
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
