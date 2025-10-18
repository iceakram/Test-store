const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { productValidation, reviewValidation } = require('../middleware/validationMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, admin, productValidation, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews')
  .post(protect, reviewValidation, createProductReview);

module.exports = router;
