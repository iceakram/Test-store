const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getCart)
  .delete(protect, clearCart);

router.post('/items', protect, addToCart);

router.route('/items/:id')
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

module.exports = router;
