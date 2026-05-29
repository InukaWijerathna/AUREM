const express = require('express');
const {
  getProducts, getProductBySlug, getProductById,
  createProduct, updateProduct, deleteProduct, deleteProductImage,
  createReview, deleteReview, getFeaturedProducts,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { upload } = require('../config/cloudinary');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/', apiLimiter, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/id/:id', protect, admin, getProductById);
router.get('/:slug', getProductBySlug);

router.post('/', protect, admin, upload.array('images', 6), createProduct);
router.put('/:id', protect, admin, upload.array('images', 6), updateProduct);
router.delete('/:id/images/:publicId', protect, admin, deleteProductImage);
router.delete('/:id', protect, admin, deleteProduct);

router.post('/:id/reviews', protect, createReview);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

module.exports = router;
