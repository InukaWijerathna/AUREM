const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number, default: 0 }, // 0 = no cap
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usageCount: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.methods.isValid = function (orderAmount) {
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  if (new Date() > this.expiresAt) return { valid: false, message: 'Coupon has expired' };
  if (this.usageLimit > 0 && this.usageCount >= this.usageLimit)
    return { valid: false, message: 'Coupon usage limit reached' };
  if (orderAmount < this.minOrderAmount)
    return {
      valid: false,
      message: `Minimum order amount is $${this.minOrderAmount}`,
    };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (orderAmount) {
  let discount =
    this.discountType === 'percentage'
      ? (orderAmount * this.discountValue) / 100
      : this.discountValue;

  if (this.maxDiscountAmount > 0) {
    discount = Math.min(discount, this.maxDiscountAmount);
  }
  return Math.min(discount, orderAmount);
};

module.exports = mongoose.model('Coupon', couponSchema);
