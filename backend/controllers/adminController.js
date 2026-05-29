const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc  Get dashboard stats
// @route GET /api/admin/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalRevenue,
    monthRevenue,
    totalOrders,
    pendingOrders,
    totalProducts,
    lowStockProducts,
    totalUsers,
    recentOrders,
    monthlySales,
    topProducts,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Product.countDocuments(),
    Product.countDocuments({ stock: { $lt: 10 } }),
    User.countDocuments({ role: 'customer' }),
    Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(5)
      .select('_id status totalPrice createdAt user'),
    Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]),
    Product.find().sort('-soldCount').limit(5).select('name images soldCount price'),
  ]);

  res.json({
    success: true,
    stats: {
      totalRevenue: totalRevenue[0]?.total || 0,
      monthRevenue: monthRevenue[0]?.total || 0,
      totalOrders,
      pendingOrders,
      totalProducts,
      lowStockProducts,
      totalUsers,
    },
    recentOrders,
    monthlySales,
    topProducts,
  });
});

module.exports = { getDashboardStats };
