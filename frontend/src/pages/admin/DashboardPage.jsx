import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useGetDashboardStatsQuery } from '../../redux/api/adminApi';
import { formatCurrency, formatDate, getOrderStatusColor } from '../../utils/helpers';
import Loader from '../../components/ui/Loader';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const StatCard = ({ label, value, sub, color = 'primary' }) => (
  <div className="card p-6">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

export default function DashboardPage() {
  const { data, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) return <Loader text="Loading dashboard..." />;

  const { stats, recentOrders, monthlySales, topProducts } = data || {};

  const chartData = monthlySales?.map((d) => ({
    name: MONTHS[d._id.month - 1],
    revenue: d.revenue,
    orders: d.orders,
  })) || [];

  return (
    <>
      <Helmet><title>Dashboard – Admin</title></Helmet>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={formatCurrency(stats?.totalRevenue || 0)} sub={`${formatCurrency(stats?.monthRevenue || 0)} this month`} />
        <StatCard label="Total Orders" value={stats?.totalOrders || 0} sub={`${stats?.pendingOrders || 0} pending`} />
        <StatCard label="Products" value={stats?.totalProducts || 0} sub={`${stats?.lowStockProducts || 0} low stock`} />
        <StatCard label="Customers" value={stats?.totalUsers || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Chart */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Revenue (Last 12 Months)</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          )}
        </div>

        {/* Top Products */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-3">
            {topProducts?.map((p) => (
              <div key={p._id} className="flex items-center gap-3">
                <img src={p.images?.[0]?.url} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.soldCount} sold</p>
                </div>
                <span className="text-sm font-semibold text-primary-600">{formatCurrency(p.price)}</span>
              </div>
            ))}
            {!topProducts?.length && <p className="text-sm text-gray-400">No sales data yet</p>}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-primary-600 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders?.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link to={`/admin/orders/${order._id}`} className="font-mono text-xs text-primary-600 hover:underline">
                      #{order._id.slice(-6).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{order.user?.name}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${getOrderStatusColor(order.status)} capitalize`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-3 font-semibold text-sm">{formatCurrency(order.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
