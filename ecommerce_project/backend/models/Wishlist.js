const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Wishlist = sequelize.define('Wishlist', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
}, {
  timestamps: true,
});

module.exports = Wishlist;
