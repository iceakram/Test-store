const { Order, OrderItem, Cart, CartItem, Product, Coupon } = require('../models');
const { sequelize } = require('../config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { 
      shippingAddress, 
      billingAddress, 
      paymentMethod,
      couponCode,
      customerNote
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }],
      transaction: t
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate totals
    let subtotal = 0;
    cart.items.forEach(item => {
      subtotal += parseFloat(item.product.price) * item.quantity;
    });

    let discount = 0;
    let coupon = null;

    // Apply coupon if provided
    if (couponCode) {
      coupon = await Coupon.findOne({ 
        where: { code: couponCode, isActive: true },
        transaction: t
      });

      if (coupon) {
        const now = new Date();
        if (coupon.startsAt && new Date(coupon.startsAt) > now) {
          await t.rollback();
          return res.status(400).json({ message: 'Coupon is not yet valid' });
        }
        if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
          await t.rollback();
          return res.status(400).json({ message: 'Coupon has expired' });
        }
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
          await t.rollback();
          return res.status(400).json({ message: 'Coupon usage limit reached' });
        }
        if (subtotal < coupon.minimumPurchase) {
          await t.rollback();
          return res.status(400).json({ 
            message: `Minimum purchase of ${coupon.minimumPurchase} required` 
          });
        }

        if (coupon.discountType === 'percentage') {
          discount = (subtotal * parseFloat(coupon.discountValue)) / 100;
        } else {
          discount = parseFloat(coupon.discountValue);
        }
      }
    }

    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping - discount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      orderNumber,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      customerNote,
      couponId: coupon ? coupon.id : null
    }, { transaction: t });

    // Create order items
    for (const item of cart.items) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.product.id,
        productName: item.product.name,
        productSku: item.product.sku,
        quantity: item.quantity,
        price: item.product.price,
        total: parseFloat(item.product.price) * item.quantity,
        variant: item.variant,
        image: item.product.images?.[0]
      }, { transaction: t });

      // Update product inventory
      if (item.product.trackInventory) {
        await item.product.decrement('quantity', { 
          by: item.quantity,
          transaction: t
        });
      }
    }

    // Update coupon usage
    if (coupon) {
      await coupon.increment('usedCount', { transaction: t });
    }

    // Clear cart
    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

    await t.commit();

    // Fetch complete order
    const completeOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    res.status(201).json({
      success: true,
      data: completeOrder
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders for user
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user or user is admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;

    if (status === 'shipped') {
      order.shippedAt = new Date();
    } else if (status === 'delivered') {
      order.deliveredAt = new Date();
    } else if (status === 'cancelled') {
      order.cancelledAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus
};
