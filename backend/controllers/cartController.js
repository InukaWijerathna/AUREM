const asyncHandler = require('../middleware/asyncHandler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const populateCart = (query) =>
  query.populate('items.product', 'name slug images price discountPrice stock');

// @desc  Get cart
// @route GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  let cart = await populateCart(Cart.findOne({ user: req.user._id }));
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  res.json({ success: true, cart });
});

// @desc  Add item to cart
// @route POST /api/cart/add
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, variant } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.stock < 1) {
    res.status(400);
    throw new Error('Product is out of stock');
  }

  const price = product.discountPrice > 0 && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (i) =>
      i.product.toString() === productId &&
      JSON.stringify(i.variant) === JSON.stringify(variant)
  );

  if (existingItemIndex > -1) {
    const newQty = cart.items[existingItemIndex].quantity + quantity;
    if (newQty > product.stock) {
      res.status(400);
      throw new Error(`Only ${product.stock} units available`);
    }
    cart.items[existingItemIndex].quantity = newQty;
  } else {
    cart.items.push({ product: productId, quantity, price, variant });
  }

  await cart.save();
  cart = await populateCart(Cart.findById(cart._id));
  res.json({ success: true, cart });
});

// @desc  Update cart item quantity
// @route PUT /api/cart/update
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity, variant } = req.body;

  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const product = await Product.findById(productId);
  if (product && quantity > product.stock) {
    res.status(400);
    throw new Error(`Only ${product.stock} units available`);
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.find(
    (i) =>
      i.product.toString() === productId &&
      JSON.stringify(i.variant) === JSON.stringify(variant)
  );

  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  item.quantity = quantity;
  await cart.save();
  const updatedCart = await populateCart(Cart.findById(cart._id));
  res.json({ success: true, cart: updatedCart });
});

// @desc  Remove item from cart
// @route DELETE /api/cart/remove/:productId
const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== req.params.productId
  );
  await cart.save();
  const updatedCart = await populateCart(Cart.findById(cart._id));
  res.json({ success: true, cart: updatedCart });
});

// @desc  Clear cart
// @route DELETE /api/cart/clear
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [], couponCode: '', discount: 0 }
  );
  res.json({ success: true, message: 'Cart cleared' });
});

// @desc  Apply coupon
// @route POST /api/cart/coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  const cart = await populateCart(Cart.findOne({ user: req.user._id }));
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const validation = coupon.isValid(subtotal);

  if (!validation.valid) {
    res.status(400);
    throw new Error(validation.message);
  }

  const discount = coupon.calculateDiscount(subtotal);
  cart.couponCode = coupon.code;
  cart.discount = discount;
  await cart.save();

  res.json({ success: true, discount, couponCode: coupon.code, message: 'Coupon applied!' });
});

// @desc  Remove coupon
// @route DELETE /api/cart/coupon
const removeCoupon = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { couponCode: '', discount: 0 });
  res.json({ success: true, message: 'Coupon removed' });
});

module.exports = {
  getCart, addToCart, updateCartItem, removeCartItem, clearCart,
  applyCoupon, removeCoupon,
};
