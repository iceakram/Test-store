# E-Commerce Platform

A comprehensive, scalable e-commerce platform built with modern technologies including Node.js, Express, PostgreSQL, Redis, Next.js, React, and Tailwind CSS.

## 🚀 Features

### Product Management
- Comprehensive product catalog with categories
- Product variants and SKU management
- Inventory tracking and low stock alerts
- Bulk import/export functionality
- Image gallery support
- SEO optimization (meta titles, descriptions, slugs)

### User Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Customer, Seller, Admin)
- Password encryption with bcrypt
- Social login support (Google, Facebook)
- Email verification
- Password reset functionality

### Shopping Cart & Checkout
- Persistent shopping carts
- Real-time cart updates
- Coupon code support (percentage and fixed discounts)
- Multiple payment gateways (Stripe, PayPal)
- Tax calculation
- Shipping cost calculation
- Guest checkout option

### Order Management
- Complete order lifecycle tracking
- Status updates (pending, confirmed, processing, shipped, delivered, cancelled)
- Order history for customers
- Admin dashboard for order management
- Email notifications
- Tracking number support

### Security
- HTTPS enforcement
- Helmet.js for security headers
- Rate limiting
- CSRF protection
- SQL injection prevention (Sequelize ORM)
- XSS protection
- Input validation and sanitization
- PCI DSS compliant payment processing

### Performance & Scalability
- Redis caching for sessions and frequently accessed data
- Database query optimization
- Compression middleware
- CDN ready
- Containerized with Docker
- Microservices architecture ready
- Cloud-ready deployment

### User Interface
- Responsive design (mobile, tablet, desktop)
- Tailwind CSS for modern styling
- Accessibility compliant (WCAG)
- Fast page loads with Next.js
- Image optimization
- SEO friendly

## 🛠️ Tech Stack

### Backend
- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Cache**: Redis
- **Authentication**: JWT, Passport.js
- **Payment**: Stripe, PayPal
- **Email**: Nodemailer
- **Validation**: express-validator, Joi
- **Security**: Helmet, express-rate-limit, bcryptjs

### Frontend
- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Yup
- **Icons**: Heroicons

### DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud**: AWS, Google Cloud, Azure compatible

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

## 🚀 Getting Started

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/iceakram/Test-store.git
cd Test-store/ecommerce_project
```

2. Create environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Update the environment variables in both `.env` files

4. Start the application:
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Manual Installation

#### Backend Setup

1. Navigate to backend directory:
```bash
cd ecommerce_project/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`

5. Start PostgreSQL and Redis

6. Run the server:
```bash
# Development
npm run dev

# Production
npm start
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd ecommerce_project/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Update environment variables

5. Run the development server:
```bash
npm run dev
```

6. Build for production:
```bash
npm run build
npm start
```

## 📖 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Product Endpoints

#### Get All Products
```
GET /api/products?page=1&limit=12&category=<categoryId>&search=<query>&minPrice=<price>&maxPrice=<price>
```

#### Get Single Product
```
GET /api/products/:id
```

#### Create Product (Admin/Seller)
```
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "sku": "PROD-001",
  "categoryId": "category-uuid",
  "quantity": 100
}
```

### Cart Endpoints

#### Get Cart
```
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart
```
POST /api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product-uuid",
  "quantity": 1
}
```

### Order Endpoints

#### Create Order
```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "stripe"
}
```

#### Get Orders
```
GET /api/orders
Authorization: Bearer <token>
```

## 🔒 Security Features

1. **Authentication**: JWT tokens with secure HTTP-only cookies
2. **Password Security**: Bcrypt hashing with salt rounds
3. **Rate Limiting**: Prevent brute force attacks
4. **CSRF Protection**: Cross-site request forgery prevention
5. **XSS Protection**: Input sanitization and output encoding
6. **SQL Injection**: Sequelize ORM with parameterized queries
7. **HTTPS**: SSL/TLS encryption in production
8. **Helmet**: Security headers middleware

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

### Docker Deployment

Build and push images:
```bash
docker-compose build
docker-compose push
```

### Cloud Deployment (AWS, Google Cloud, Azure)

Refer to the deployment guide in `docs/deployment.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@ecommerce.com or open an issue in the repository.