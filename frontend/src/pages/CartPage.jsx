import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation, useClearCartMutation, useApplyCouponMutation, useRemoveCouponMutation } from '../redux/api/cartApi';
import { selectIsLoggedIn } from '../redux/authSlice';
import { selectCartItems, selectCartSubtotal, selectCartDiscount } from '../redux/cartSlice';
import { formatCurrency, getErrorMessage } from '../utils/helpers';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 10;

export default function CartPage() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const discount = useSelector(selectCartDiscount);
  const [couponCode, setCouponCode] = useState('');

  useGetCartQuery(undefined, { skip: !isLoggedIn });
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveCartItemMutation();
  const [clearCart] = useClearCartMutation();
  const [applyCoupon, { isLoading: applyingCoupon }] = useApplyCouponMutation();
  const [removeCoupon] = useRemoveCouponMutation();

  const discountedSubtotal = Math.max(subtotal - discount, 0);
  const shipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = discountedSubtotal * TAX_RATE;
  const total = discountedSubtotal + shipping + tax;

  const handleQty = async (productId, quantity, variant) => {
    if (quantity < 1) return;
    try {
      await updateItem({ productId, quantity, variant }).unwrap();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId).unwrap();
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await applyCoupon({ code: couponCode }).unwrap();
      toast.success(`Coupon applied! You saved ${formatCurrency(res.discount)}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon().unwrap();
    setCouponCode('');
    toast.success('Coupon removed');
  };

  if (!isLoggedIn) {
    return (
      <div className="container-custom py-16 text-center">
        <p className="text-gray-500 mb-4">Please login to view your cart</p>
        <Link to="/login" className="btn-primary px-8 py-3">Login</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
        <Link to="/products" className="btn-primary px-8 py-3">Start Shopping</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Cart — AUREM</title></Helmet>
      <div className="container-custom py-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart ({items.length} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.product?._id}-${JSON.stringify(item.variant)}`} className="card p-4 sm:p-5 flex gap-3 sm:gap-4">
                <Link to={`/products/${item.product?.slug}`} className="shrink-0">
                  <img
                    src={item.product?.images?.[0]?.url}
                    alt={item.product?.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-gray-100"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product?.slug}`} className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2">
                    {item.product?.name}
                  </Link>
                  {item.variant && (
                    <p className="text-sm text-gray-500 mt-0.5">{item.variant.name}: {item.variant.value}</p>
                  )}
                  <p className="text-primary-600 font-bold mt-1">{formatCurrency(item.price)}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button onClick={() => handleQty(item.product?._id, item.quantity - 1, item.variant)} className="px-3 py-1.5 hover:bg-gray-50" disabled={item.quantity <= 1}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                      </button>
                      <span className="px-4 py-1.5 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => handleQty(item.product?._id, item.quantity + 1, item.variant)} className="px-3 py-1.5 hover:bg-gray-50">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                      <button onClick={() => handleRemove(item.product?._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => clearCart()} className="text-sm text-red-500 hover:underline">
              Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Promo Code</h3>
              {discount > 0 ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-medium">Coupon applied! -{formatCurrency(discount)}</span>
                  <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="WELCOME10"
                    className="input text-sm flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button onClick={handleApplyCoupon} disabled={applyingCoupon} className="btn-primary text-sm px-4">
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="card p-5 space-y-3">
              <h3 className="font-semibold text-gray-900">Order Summary</h3>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span><span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatCurrency(shipping)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Tax (8%)</span><span>{formatCurrency(tax)}</span></div>
              {discountedSubtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-gray-500">Add {formatCurrency(FREE_SHIPPING_THRESHOLD - discountedSubtotal)} more for free shipping</p>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-3">
                <span>Total</span><span>{formatCurrency(total)}</span>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-primary w-full py-3">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
