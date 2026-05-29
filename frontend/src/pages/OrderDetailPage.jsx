import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useGetOrderByIdQuery, useCancelOrderMutation } from '../redux/api/orderApi';
import { formatCurrency, formatDate, formatDateTime, getOrderStatusColor, getErrorMessage } from '../utils/helpers';
import Loader from '../components/ui/Loader';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderByIdQuery(id);
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const order = data?.order;

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder({ id, reason: 'Customer requested cancellation' }).unwrap();
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) return <div className="container-custom py-12"><Loader /></div>;
  if (!order) return <div className="container-custom py-12 text-center text-gray-500">Order not found.</div>;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <>
      <Helmet><title>Order Details – EMarket</title></Helmet>
      <div className="container-custom py-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'My Orders', href: '/orders' }, { label: 'Order Details' }]} />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">{order._id}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`badge ${getOrderStatusColor(order.status)} capitalize text-sm px-3 py-1`}>{order.status}</span>
            {['pending', 'processing'].includes(order.status) && (
              <button onClick={handleCancel} disabled={cancelling} className="btn-danger text-sm px-4 py-2">
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* Tracking */}
        {!['cancelled', 'refunded'].includes(order.status) && (
          <div className="card p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Order Tracking</h2>
            <div className="flex items-center gap-0">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <div className={`flex-1 h-1 ${i < STATUS_STEPS.length - 1 ? (i < currentStep ? 'bg-primary-600' : 'bg-gray-200') : 'hidden'}`} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {STATUS_STEPS.map((step) => (
                <span key={step} className="text-xs text-gray-500 capitalize flex-1 text-center">{step}</span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
              <div className="space-y-4">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />
                    <div className="flex-1">
                      <Link to={`/products/${item.slug}`} className="font-medium text-gray-900 hover:text-primary-600">{item.name}</Link>
                      {item.variant && <p className="text-sm text-gray-500">{item.variant.name}: {item.variant.value}</p>}
                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <span className="font-semibold">{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card p-6 h-fit space-y-3">
            <h2 className="font-semibold text-gray-900">Order Summary</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">Date</span><span>{formatDate(order.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Payment</span><span>{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatCurrency(order.itemsPrice)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{formatCurrency(order.shippingPrice)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>{formatCurrency(order.taxPrice)}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                <span>Total</span><span>{formatCurrency(order.totalPrice)}</span>
              </div>
              <div className={`badge mt-2 ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {order.isPaid ? `Paid on ${formatDate(order.paidAt)}` : 'Not paid yet'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
