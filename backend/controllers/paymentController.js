const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/Order');

// Stripe is optional — only initialize if key is present
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// @desc  Create Stripe payment intent
// @route POST /api/payment/create-intent
const createPaymentIntent = asyncHandler(async (req, res) => {
  if (!stripe) {
    res.status(503);
    throw new Error('Stripe is not configured. Use COD for now.');
  }

  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // cents
    currency: 'usd',
    metadata: { orderId: order._id.toString() },
  });

  res.json({ success: true, clientSecret: paymentIntent.client_secret });
});

// @desc  Stripe webhook
// @route POST /api/payment/webhook
const stripeWebhook = asyncHandler(async (req, res) => {
  if (!stripe) {
    return res.status(200).json({ received: true });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400);
    throw new Error(`Webhook error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      paidAt: new Date(),
      status: 'processing',
      paymentResult: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
      },
    });
  }

  res.json({ received: true });
});

module.exports = { createPaymentIntent, stripeWebhook };
