import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGetMyOrdersQuery } from '../redux/api/orderApi';
import { formatCurrency, formatDate, getOrderStatusColor } from '../utils/helpers';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetMyOrdersQuery({ page, limit: 10 });

  return (
    <>
      <Helmet><title>My Orders — AUREM</title></Helmet>
      <div className="container-custom py-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'My Orders' }]} />
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

        {isLoading ? (
          <Loader text="Loading orders..." />
        ) : data?.orders?.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 mb-4">No orders yet</p>
            <Link to="/products" className="btn-primary px-8 py-3">Start Shopping</Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Order</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-mono text-xs text-gray-500">{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${getOrderStatusColor(order.status)} capitalize`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</td>
                      <td className="px-6 py-4">
                        <Link to={`/orders/${order._id}`} className="text-primary-600 text-sm font-medium hover:underline">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {data && (
          <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
        )}
      </div>
    </>
  );
}
