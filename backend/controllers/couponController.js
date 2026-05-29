const asyncHandler = require('../middleware/asyncHandler');
const Coupon = require('../models/Coupon');

// @desc  Validate coupon (public)
// @route POST /api/coupons/validate
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  const validation = coupon.isValid(orderAmount);
  if (!validation.valid) {
    res.status(400);
    throw new Error(validation.message);
  }

  const discount = coupon.calculateDiscount(orderAmount);
  res.json({
    success: true,
    discount,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
  });
});

// @desc  Get all coupons (admin)
// @route GET /api/coupons
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.json({ success: true, coupons });
});

// @desc  Create coupon (admin)
// @route POST /api/coupons
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

// @desc  Update coupon (admin)
// @route PUT /api/coupons/:id
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  res.json({ success: true, coupon });
});

// @desc  Delete coupon (admin)
// @route DELETE /api/coupons/:id
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  res.json({ success: true, message: 'Coupon deleted' });
});

module.exports = { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon };
