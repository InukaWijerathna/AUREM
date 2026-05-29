const express = require('express');
const { getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);

module.exports = router;
