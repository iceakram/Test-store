require('dotenv').config();
const { sequelize } = require('../config/db');
const { User, Product, Category, Coupon } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    
    console.log('Syncing database...');
    await sequelize.sync({ force: true }); // WARNING: This will drop all tables
    
    console.log('Creating categories...');
    const categories = await Category.bulkCreate([
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home and garden products',
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports and outdoor equipment',
        isActive: true,
        sortOrder: 4
      }
    ]);
    
    console.log('Creating admin user...');
    await User.create({
      email: 'admin@ecommerce.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
      isEmailVerified: true
    });
    
    console.log('Creating test customer...');
    await User.create({
      email: 'customer@test.com',
      password: 'customer123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      role: 'customer',
      isActive: true,
      isEmailVerified: true
    });
    
    console.log('Creating products...');
    const products = [];
    
    // Electronics
    products.push({
      name: 'Wireless Headphones',
      slug: 'wireless-headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 199.99,
      compareAtPrice: 249.99,
      sku: 'ELECT-001',
      quantity: 50,
      categoryId: categories[0].id,
      isFeatured: true,
      status: 'active',
      tags: ['electronics', 'audio', 'wireless']
    });
    
    products.push({
      name: 'Smart Watch',
      slug: 'smart-watch',
      description: 'Fitness tracking smartwatch with heart rate monitor',
      price: 299.99,
      sku: 'ELECT-002',
      quantity: 30,
      categoryId: categories[0].id,
      isFeatured: true,
      status: 'active',
      tags: ['electronics', 'wearable', 'fitness']
    });
    
    products.push({
      name: 'Laptop',
      slug: 'laptop-15-inch',
      description: '15-inch laptop with high performance processor',
      price: 1299.99,
      compareAtPrice: 1499.99,
      sku: 'ELECT-003',
      quantity: 15,
      categoryId: categories[0].id,
      status: 'active',
      tags: ['electronics', 'computers', 'laptop']
    });
    
    // Clothing
    products.push({
      name: 'Cotton T-Shirt',
      slug: 'cotton-t-shirt',
      description: '100% cotton comfortable t-shirt',
      price: 29.99,
      sku: 'CLOTH-001',
      quantity: 100,
      categoryId: categories[1].id,
      isFeatured: true,
      status: 'active',
      tags: ['clothing', 'casual', 'cotton']
    });
    
    products.push({
      name: 'Denim Jeans',
      slug: 'denim-jeans',
      description: 'Classic fit denim jeans',
      price: 79.99,
      sku: 'CLOTH-002',
      quantity: 75,
      categoryId: categories[1].id,
      status: 'active',
      tags: ['clothing', 'jeans', 'denim']
    });
    
    // Home & Garden
    products.push({
      name: 'Coffee Maker',
      slug: 'coffee-maker',
      description: 'Programmable coffee maker with thermal carafe',
      price: 89.99,
      sku: 'HOME-001',
      quantity: 40,
      categoryId: categories[2].id,
      isFeatured: true,
      status: 'active',
      tags: ['home', 'kitchen', 'appliances']
    });
    
    products.push({
      name: 'Garden Tool Set',
      slug: 'garden-tool-set',
      description: 'Complete garden tool set with carrying case',
      price: 59.99,
      sku: 'HOME-002',
      quantity: 25,
      categoryId: categories[2].id,
      status: 'active',
      tags: ['garden', 'tools', 'outdoor']
    });
    
    // Sports
    products.push({
      name: 'Yoga Mat',
      slug: 'yoga-mat',
      description: 'Non-slip yoga mat with carrying strap',
      price: 39.99,
      sku: 'SPORT-001',
      quantity: 60,
      categoryId: categories[3].id,
      isFeatured: true,
      status: 'active',
      tags: ['sports', 'fitness', 'yoga']
    });
    
    products.push({
      name: 'Running Shoes',
      slug: 'running-shoes',
      description: 'Lightweight running shoes with cushioned sole',
      price: 129.99,
      compareAtPrice: 159.99,
      sku: 'SPORT-002',
      quantity: 45,
      categoryId: categories[3].id,
      status: 'active',
      tags: ['sports', 'footwear', 'running']
    });
    
    await Product.bulkCreate(products);
    
    console.log('Creating coupons...');
    await Coupon.bulkCreate([
      {
        code: 'WELCOME10',
        description: '10% off for new customers',
        discountType: 'percentage',
        discountValue: 10,
        minimumPurchase: 50,
        maxUses: 100,
        isActive: true
      },
      {
        code: 'SAVE20',
        description: '$20 off on orders over $100',
        discountType: 'fixed',
        discountValue: 20,
        minimumPurchase: 100,
        maxUses: 50,
        isActive: true
      }
    ]);
    
    console.log('Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@ecommerce.com / admin123');
    console.log('Customer: customer@test.com / customer123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
