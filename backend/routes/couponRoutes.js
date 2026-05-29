const express = require('express');
const {
  validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon,
} = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/validate', protect, validateCoupon);

router.use(protect, admin);
router.get('/', getCoupons);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;
