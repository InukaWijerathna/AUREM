const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 10;

// @desc  Create order
// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'COD', notes = '' } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name slug images price discountPrice stock'
  );

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  // Validate stock & build order items
  const orderItems = [];
  for (const item of cart.items) {
    const product = item.product;
    if (!product || product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product?.name || 'a product'}`);
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url || '',
      price: item.price,
      qty: item.quantity,
      variant: item.variant,
    });
  }

  const itemsPrice = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = cart.discount || 0;
  const discountedItems = Math.max(itemsPrice - discount, 0);
  const shippingPrice = discountedItems >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const taxPrice = parseFloat((discountedItems * TAX_RATE).toFixed(2));
  const totalPrice = parseFloat((discountedItems + shippingPrice + taxPrice).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    discount,
    totalPrice,
    couponCode: cart.couponCode,
    notes,
    isPaid: paymentMethod === 'COD' ? false : false,
  });

  // Decrement stock
  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty, soldCount: item.qty },
      })
    )
  );

  // Increment coupon usage
  if (cart.couponCode) {
    await Coupon.findOneAndUpdate({ code: cart.couponCode }, { $inc: { usageCount: 1 } });
  }

  // Clear cart
  await Cart.findByIdAndUpdate(cart._id, { items: [], couponCode: '', discount: 0 });

  // Send confirmation email
  try {
    await sendEmail({
      to: req.user.email,
      subject: `Order Confirmed - #${order._id}`,
      html: emailTemplates.orderConfirmation(req.user.name, order._id, order.totalPrice),
    });
  } catch { /* non-blocking */ }

  res.status(201).json({ success: true, order });
});

// @desc  Get my orders
// @route GET /api/orders/my-orders
const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id }).sort('-createdAt').skip(skip).limit(limit),
    Order.countDocuments({ user: req.user._id }),
  ]);

  res.json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
});

// @desc  Get order by ID
// @route GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  res.json({ success: true, order });
});

// @desc  Mark order as paid (Stripe callback / admin)
// @route PUT /api/orders/:id/pay
const markOrderPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'processing';
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };
  await order.save();
  res.json({ success: true, order });
});

// @desc  Cancel order
// @route PUT /api/orders/:id/cancel
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (['shipped', 'delivered'].includes(order.status)) {
    res.status(400);
    throw new Error('Cannot cancel a shipped or delivered order');
  }

  // Restore stock
  await Promise.all(
    order.orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty, soldCount: -item.qty },
      })
    )
  );

  order.status = 'cancelled';
  order.cancelReason = req.body.reason || '';
  await order.save();

  res.json({ success: true, order });
});

// ---- Admin ----

// @desc  Get all orders (admin)
// @route GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort('-createdAt').skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  res.json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
});

// @desc  Update order status (admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = req.body.status;
  if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;

  if (req.body.status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    if (order.paymentMethod === 'COD') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }
  }

  await order.save();

  if (req.body.status === 'shipped') {
    const user = await (require('../models/User')).findById(order.user);
    if (user) {
      try {
        await sendEmail({
          to: user.email,
          subject: `Your order has shipped - #${order._id}`,
          html: emailTemplates.orderShipped(user.name, order._id, order.trackingNumber),
        });
      } catch { /* non-blocking */ }
    }
  }

  res.json({ success: true, order });
});

module.exports = {
  createOrder, getMyOrders, getOrderById, markOrderPaid,
  cancelOrder, getAllOrders, updateOrderStatus,
};
