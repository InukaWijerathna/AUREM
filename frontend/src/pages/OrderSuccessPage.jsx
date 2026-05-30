import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGetOrderByIdQuery } from '../redux/api/orderApi';
import { formatCurrency, formatDate } from '../utils/helpers';
import Loader from '../components/ui/Loader';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderByIdQuery(id);
  const order = data?.order;

  if (isLoading) return <div className="container-custom py-16"><Loader text="Loading order..." /></div>;

  return (
    <>
      <Helmet><title>Order Confirmed — AUREM</title></Helmet>
      <div className="container-custom py-16 max-w-2xl">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500">Thank you for your purchase. We'll send you a confirmation email shortly.</p>
          {order && (
            <p className="text-sm text-gray-400 mt-2">Order ID: <span className="font-mono">{order._id}</span></p>
          )}
        </div>

        {order && (
          <div className="card p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Order Date</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="font-medium">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Card'}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-medium capitalize">{order.status}</p>
              </div>
              <div>
                <p className="text-gray-500">Total</p>
                <p className="font-bold text-lg text-primary-600">{formatCurrency(order.totalPrice)}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <span className="font-medium text-sm">{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <Link to={`/orders/${order._id}`} className="btn-secondary flex-1 text-center py-3">View Order</Link>
              <Link to="/products" className="btn-primary flex-1 text-center py-3">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
