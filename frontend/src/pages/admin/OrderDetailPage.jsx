import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '../../redux/api/orderApi';
import { formatCurrency, formatDate, getOrderStatusColor, getErrorMessage } from '../../utils/helpers';
import Loader from '../../components/ui/Loader';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetOrderByIdQuery(id);
  const [updateStatus, { isLoading: updating }] = useUpdateOrderStatusMutation();
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const order = data?.order;

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    try {
      await updateStatus({ id, status: newStatus, trackingNumber }).unwrap();
      toast.success('Order status updated!');
      setNewStatus('');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) return <Loader />;
  if (!order) return <p className="text-gray-500">Order not found.</p>;

  return (
    <>
      <Helmet><title>Order Details – Admin</title></Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-500 text-sm font-mono mt-1">{order._id}</p>
        </div>
        <button onClick={() => navigate(-1)} className="btn-secondary text-sm">Back</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.orderItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg bg-gray-100" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.qty} × {formatCurrency(item.price)}</p>
                  </div>
                  <span className="font-semibold">{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Shipping Address</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
              <p>{order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Update Status */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Update Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input text-sm">
                <option value="">Select status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Tracking number (optional)"
                className="input text-sm"
              />
              <button onClick={handleUpdateStatus} disabled={!newStatus || updating} className="btn-primary text-sm">
                {updating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit space-y-3">
          <h2 className="font-semibold text-gray-900">Order Summary</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span className="text-gray-600">Customer</span><span className="font-medium">{order.user?.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Email</span><span className="text-xs">{order.user?.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Date</span><span>{formatDate(order.createdAt)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Payment</span><span>{order.paymentMethod}</span></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <span className={`badge ${getOrderStatusColor(order.status)} capitalize`}>{order.status}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 space-y-1">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatCurrency(order.itemsPrice)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{formatCurrency(order.shippingPrice)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>{formatCurrency(order.taxPrice)}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                <span>Total</span><span>{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
            <div className={`badge ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {order.isPaid ? 'Paid' : 'Unpaid'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
