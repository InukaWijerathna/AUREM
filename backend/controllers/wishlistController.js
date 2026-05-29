const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

// @desc  Get wishlist
// @route GET /api/wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'wishlist',
    'name slug images price discountPrice stock ratings numReviews'
  );
  res.json({ success: true, wishlist: user.wishlist });
});

// @desc  Toggle wishlist item
// @route POST /api/wishlist/:productId
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const index = user.wishlist.indexOf(productId);

  let action;
  if (index > -1) {
    user.wishlist.splice(index, 1);
    action = 'removed';
  } else {
    user.wishlist.push(productId);
    action = 'added';
  }
  await user.save({ validateBeforeSave: false });

  res.json({ success: true, action, wishlist: user.wishlist });
});

// @desc  Remove from wishlist
// @route DELETE /api/wishlist/:productId
const removeFromWishlist = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { wishlist: req.params.productId },
  });
  res.json({ success: true, message: 'Removed from wishlist' });
});

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };
