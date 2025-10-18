const { Cart, CartItem, Product } = require('../models');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
            },
          ],
        },
      ],
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.countInStock < quantity) {
      res.status(400);
      throw new Error('Insufficient stock');
    }

    let cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    const existingItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
      });
    }

    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
            },
          ],
        },
      ],
    });

    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:id
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const cartItem = await CartItem.findByPk(req.params.id, {
      include: [{ model: Product, as: 'product' }],
    });

    if (!cartItem) {
      res.status(404);
      throw new Error('Cart item not found');
    }

    if (cartItem.product.countInStock < quantity) {
      res.status(400);
      throw new Error('Insufficient stock');
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json(cartItem);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:id
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.id);

    if (!cartItem) {
      res.status(404);
      throw new Error('Cart item not found');
    }

    await cartItem.destroy();

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
