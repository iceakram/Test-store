const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 255],
    },
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shortDescription: {
    type: DataTypes.STRING(500),
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  comparePrice: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0,
    },
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0,
    },
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  thumbnail: {
    type: DataTypes.STRING,
  },
  countInStock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  lowStockThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  numReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  metaTitle: {
    type: DataTypes.STRING,
  },
  metaDescription: {
    type: DataTypes.TEXT,
  },
  metaKeywords: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['slug'] },
    { fields: ['sku'] },
    { fields: ['isActive'] },
    { fields: ['isFeatured'] },
    { fields: ['rating'] },
  ],
});

module.exports = Product;
