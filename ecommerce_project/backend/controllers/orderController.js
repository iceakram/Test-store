const { Order, OrderItem, Product, Cart, CartItem } = require('../models');
const { v4: uuidv4 } = require('uuid');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingCost,
      taxAmount,
      couponCode,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    let subtotal = 0;
    const items = [];

    // Validate products and calculate subtotal
    for (const item of orderItems) {
      const product = await Product.findByPk(item.productId);
      
      if (!product) {
        res.status(404);
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.countInStock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      items.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
        productSnapshot: {
          name: product.name,
          sku: product.sku,
          image: product.thumbnail,
        },
      });
    }

    const tax = taxAmount || subtotal * 0.1; // 10% tax
    const discount = 0; // TODO: Apply coupon discount
    const total = subtotal + tax + (shippingCost || 0) - discount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      orderNumber,
      subtotal,
      tax,
      shippingCost: shippingCost || 0,
      discount,
      total,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
    });

    // Create order items
    for (const item of items) {
      await OrderItem.create({
        ...item,
        orderId: order.id,
      });

      // Update product stock
      const product = await Product.findByPk(item.productId);
      product.countInStock -= item.quantity;
      await product.save();
    }

    // Clear user's cart
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
    }

    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Check if user owns the order or is admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      where: { userId: req.user.id },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });

    res.json({
      orders,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const where = {};

    if (req.query.status) {
      where.status = req.query.status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: OrderItem,
          as: 'items',
        },
      ],
    });

    res.json({
      orders,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentStatus = 'paid';
    order.paymentDetails = req.body;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
};
