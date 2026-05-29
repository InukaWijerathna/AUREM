const express = require('express');
const {
  getMe, updateMe, updateAvatar, changePassword,
  addAddress, updateAddress, deleteAddress,
  getAllUsers, getUserById, updateUser, deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.put('/me', updateMe);
router.put('/me/avatar', upload.single('avatar'), updateAvatar);
router.put('/change-password', changePassword);

router.post('/me/addresses', addAddress);
router.put('/me/addresses/:addressId', updateAddress);
router.delete('/me/addresses/:addressId', deleteAddress);

// Admin routes
router.get('/', admin, getAllUsers);
router.get('/:id', admin, getUserById);
router.put('/:id', admin, updateUser);
router.delete('/:id', admin, deleteUser);

module.exports = router;
