const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');
const APIFeatures = require('../utils/apiFeatures');

// @desc  Get all products
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const totalQuery = new APIFeatures(Product.find(), req.query).search().filter();
  const total = await Product.countDocuments(totalQuery.query.getFilter());

  const features = new APIFeatures(
    Product.find().populate('category', 'name slug'),
    req.query
  )
    .search()
    .filter()
    .sort()
    .paginate();

  const products = await features.query;

  res.json({
    success: true,
    products,
    total,
    page: features.page,
    pages: Math.ceil(total / features.limit),
    limit: features.limit,
  });
});

// @desc  Get single product by slug
// @route GET /api/products/:slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category', 'name slug')
    .populate('reviews.user', 'name avatar');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
});

// @desc  Get product by ID (admin)
// @route GET /api/products/id/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
});

// @desc  Create product (admin)
// @route POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const images = req.files
    ? req.files.map((f) => ({ public_id: f.filename, url: f.path }))
    : [];

  const product = await Product.create({ ...req.body, images });
  res.status(201).json({ success: true, product });
});

// @desc  Update product (admin)
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Append new images if uploaded
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((f) => ({ public_id: f.filename, url: f.path }));
    req.body.images = [...product.images, ...newImages];
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, product: updated });
});

// @desc  Delete product image (admin)
// @route DELETE /api/products/:id/images/:publicId
const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const publicId = decodeURIComponent(req.params.publicId);
  await cloudinary.uploader.destroy(publicId);
  product.images = product.images.filter((img) => img.public_id !== publicId);
  await product.save();

  res.json({ success: true, images: product.images });
});

// @desc  Delete product (admin)
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  // Delete all images from Cloudinary
  await Promise.all(product.images.map((img) => cloudinary.uploader.destroy(img.public_id)));
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});

// @desc  Create review
// @route POST /api/products/:id/reviews
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

// @desc  Delete review
// @route DELETE /api/products/:id/reviews/:reviewId
const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const review = product.reviews.id(req.params.reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  product.reviews = product.reviews.filter(
    (r) => r._id.toString() !== req.params.reviewId
  );
  await product.save();
  res.json({ success: true, message: 'Review deleted' });
});

// @desc  Get featured products
// @route GET /api/products/featured
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true })
    .populate('category', 'name slug')
    .limit(8)
    .sort('-createdAt');
  res.json({ success: true, products });
});

module.exports = {
  getProducts, getProductBySlug, getProductById,
  createProduct, updateProduct, deleteProduct, deleteProductImage,
  createReview, deleteReview, getFeaturedProducts,
};
