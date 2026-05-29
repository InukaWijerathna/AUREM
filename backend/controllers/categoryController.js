const asyncHandler = require('../middleware/asyncHandler');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// @desc  Get all categories
// @route GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ parentCategory: null })
    .populate('subcategories', 'name slug image')
    .sort('name');
  res.json({ success: true, categories });
});

// @desc  Get single category
// @route GET /api/categories/:slug
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug })
    .populate('subcategories', 'name slug image')
    .populate('parentCategory', 'name slug');
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ success: true, category });
});

// @desc  Create category (admin)
// @route POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
  const image = req.file
    ? { public_id: req.file.filename, url: req.file.path }
    : { public_id: '', url: '' };

  const category = await Category.create({ ...req.body, image });
  res.status(201).json({ success: true, category });
});

// @desc  Update category (admin)
// @route PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (req.file) {
    if (category.image.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }
    req.body.image = { public_id: req.file.filename, url: req.file.path };
  }

  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, category: updated });
});

// @desc  Delete category (admin)
// @route DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const hasProducts = await Product.countDocuments({ category: req.params.id });
  if (hasProducts > 0) {
    res.status(400);
    throw new Error('Cannot delete category with existing products');
  }

  // Delete subcategories
  await Category.deleteMany({ parentCategory: req.params.id });
  if (category.image.public_id) {
    await cloudinary.uploader.destroy(category.image.public_id);
  }
  await category.deleteOne();

  res.json({ success: true, message: 'Category deleted' });
});

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
