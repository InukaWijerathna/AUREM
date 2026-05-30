import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useCreateOrderMutation } from '../redux/api/orderApi';
import { useGetCartQuery } from '../redux/api/cartApi';
import { selectCartItems, selectCartSubtotal, selectCartDiscount } from '../redux/cartSlice';
import { formatCurrency, getErrorMessage } from '../utils/helpers';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 10;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const discount = useSelector(selectCartDiscount);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  useGetCartQuery();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const discountedSubtotal = Math.max(subtotal - discount, 0);
  const shipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = discountedSubtotal * TAX_RATE;
  const total = discountedSubtotal + shipping + tax;

  const onSubmit = async (data) => {
    if (paymentMethod === 'stripe') {
      toast('Stripe payment is coming soon. Using COD for now.', { icon: 'ℹ️' });
      setPaymentMethod('COD');
      return;
    }
    try {
      const result = await createOrder({
        shippingAddress: data,
        paymentMethod: 'COD',
      }).unwrap();
      navigate(`/order-success/${result.order._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const inputField = (name, label, opts = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...register(name, { required: `${label} is required`, ...opts })}
        className={`input ${errors[name] ? 'input-error' : ''}`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
    </div>
  );

  return (
    <>
      <Helmet><title>Checkout — AUREM</title></Helmet>
      <div className="container-custom py-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping */}
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 text-lg mb-5">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {inputField('firstName', 'First Name')}
                  {inputField('lastName', 'Last Name')}
                  <div className="sm:col-span-2">{inputField('phone', 'Phone Number')}</div>
                  <div className="sm:col-span-2">{inputField('street', 'Street Address')}</div>
                  {inputField('city', 'City')}
                  {inputField('state', 'State')}
                  {inputField('zipCode', 'ZIP Code')}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select {...register('country')} className="input" defaultValue="US">
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="LK">Sri Lanka</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 text-lg mb-5">Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when your order arrives</p>
                    </div>
                    <span className="ml-auto text-2xl">💵</span>
                  </label>

                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors opacity-60 ${paymentMethod === 'stripe' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'}`}>
                    <input type="radio" name="payment" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} className="text-primary-600" disabled />
                    <div>
                      <p className="font-medium text-gray-900">Credit/Debit Card <span className="badge bg-yellow-100 text-yellow-700 ml-2">Coming Soon</span></p>
                      <p className="text-sm text-gray-500">Stripe secure payment</p>
                    </div>
                    <span className="ml-auto text-2xl">💳</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="card p-6 h-fit">
              <h2 className="font-semibold text-gray-900 text-lg mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.product?._id} className="flex gap-3">
                    <img src={item.product?.images?.[0]?.url} alt={item.product?.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product?.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>}
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>{formatCurrency(tax)}</span></div>
                <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                  <span>Total</span><span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button type="submit" disabled={isLoading || items.length === 0} className="btn-primary w-full py-3 mt-5 text-base">
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
