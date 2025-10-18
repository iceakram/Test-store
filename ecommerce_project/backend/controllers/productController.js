const { Product, Category, Review, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const where = { isActive: true };

    // Filter by category
    if (req.query.category) {
      where.categoryId = req.query.category;
    }

    // Search
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.search}%` } },
        { description: { [Op.iLike]: `%${req.query.search}%` } },
        { tags: { [Op.contains]: [req.query.search] } },
      ];
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      where.price = {};
      if (req.query.minPrice) where.price[Op.gte] = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) where.price[Op.lte] = parseFloat(req.query.maxPrice);
    }

    // Featured
    if (req.query.featured === 'true') {
      where.isFeatured = true;
    }

    // Sorting
    let order = [['createdAt', 'DESC']];
    if (req.query.sortBy) {
      const sortOptions = {
        'price-asc': [['price', 'ASC']],
        'price-desc': [['price', 'DESC']],
        'name-asc': [['name', 'ASC']],
        'name-desc': [['name', 'DESC']],
        'rating': [['rating', 'DESC']],
        'newest': [['createdAt', 'DESC']],
      };
      order = sortOptions[req.query.sortBy] || order;
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug'],
        },
      ],
    });

    res.json({
      products,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug'],
        },
        {
          model: Review,
          as: 'reviews',
          where: { isApproved: true },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'avatar'],
            },
          ],
        },
      ],
    });

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      comparePrice,
      costPrice,
      sku,
      categoryId,
      countInStock,
      images,
      tags,
    } = req.body;

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    const product = await Product.create({
      name,
      slug,
      description,
      shortDescription,
      price,
      comparePrice,
      costPrice,
      sku,
      categoryId,
      countInStock,
      images,
      thumbnail: images && images[0],
      tags,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const updatedProduct = await product.update(req.body);

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await product.destroy();

    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, title } = req.body;

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      where: {
        productId: req.params.id,
        userId: req.user.id,
      },
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = await Review.create({
      rating,
      comment,
      title,
      userId: req.user.id,
      productId: req.params.id,
    });

    // Update product rating
    const reviews = await Review.findAll({
      where: { productId: req.params.id, isApproved: true },
    });

    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    product.rating = avgRating;
    product.numReviews = reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
