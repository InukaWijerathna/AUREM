const express = require('express');
const { createPaymentIntent, stripeWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Webhook uses raw body (set in server.js before json parser)
router.post('/webhook', stripeWebhook);

router.post('/create-intent', protect, createPaymentIntent);

module.exports = router;
