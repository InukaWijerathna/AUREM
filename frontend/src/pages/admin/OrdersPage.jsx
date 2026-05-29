import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGetAllOrdersQuery } from '../../redux/api/orderApi';
import { formatCurrency, formatDate, getOrderStatusColor } from '../../utils/helpers';
import Pagination from '../../components/ui/Pagination';
import Loader from '../../components/ui/Loader';

const STATUS_FILTERS = ['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const { data, isLoading } = useGetAllOrdersQuery({ page, limit: 20, status });

  return (
    <>
      <Helmet><title>Orders – Admin</title></Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        {data && <p className="text-sm text-gray-500">{data.total} total orders</p>}
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-2 overflow-x-auto">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium shrink-0 transition-colors ${status === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="p-8"><Loader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.orders?.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">{order.user?.name}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${getOrderStatusColor(order.status)} capitalize`}>{order.status}</span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-sm">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-5 py-3">
                      <Link to={`/admin/orders/${order._id}`} className="text-primary-600 text-sm font-medium hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {data && <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />}
    </>
  );
}
