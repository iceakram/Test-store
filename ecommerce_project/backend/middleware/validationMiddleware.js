const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().trim().withMessage('First name is required'),
  body('lastName').notEmpty().trim().withMessage('Last name is required'),
  validate,
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const productValidation = [
  body('name').notEmpty().trim().withMessage('Product name is required'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('sku').notEmpty().trim().withMessage('SKU is required'),
  body('categoryId').isUUID().withMessage('Valid category ID is required'),
  validate,
];

const orderValidation = [
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  validate,
];

const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().trim().withMessage('Comment is required'),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  productValidation,
  orderValidation,
  reviewValidation,
};
