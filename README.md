# E-Commerce Platform

A professional, full-stack e-commerce platform built with modern technologies and best practices.

## 🚀 Features

### Core Features
- **Comprehensive Product Management**
  - Categories, variants, and inventory tracking
  - SKU management with bulk import/export capabilities
  - Real-time inventory updates
  - Product reviews and ratings
  - Featured products and advanced search

- **Secure User Authentication**
  - JWT-based authentication
  - Role-based access control (Customer, Seller, Admin)
  - Password recovery and email verification
  - OAuth support (Google, Facebook) - Ready for integration
  - User profile management

- **Shopping Cart & Checkout**
  - Persistent shopping cart
  - Multi-step checkout process
  - Coupon code support
  - Multiple shipping address management
  - Real-time inventory checking

- **Order Management**
  - Order tracking with unique order numbers
  - Multiple order statuses (Pending, Processing, Shipped, Delivered, Cancelled)
  - Order history for customers
  - Admin dashboard for order management
  - Email notifications (ready for integration)

- **Payment Integration**
  - Stripe integration ready
  - PayPal integration ready
  - Secure payment processing
  - PCI DSS compliance ready

- **Responsive UI**
  - Mobile-first design with Tailwind CSS
  - Optimized for desktop, tablet, and mobile
  - Modern React components with Next.js
  - Fast page loads with server-side rendering

- **Security Features**
  - Helmet.js for security headers
  - Rate limiting on API endpoints
  - Input validation and sanitization
  - SQL injection protection
  - XSS and CSRF protection
  - Environment variable management

- **Scalability**
  - PostgreSQL for relational data
  - Redis for caching and session management
  - Docker containerization
  - Microservices-ready architecture
  - Horizontal scaling support

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: Sequelize
- **Authentication**: JWT, Passport.js
- **Validation**: Express-validator
- **Security**: Helmet, Rate limiting, HPP

### Frontend
- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **HTTP Client**: Axios
- **Icons**: Heroicons

### DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud**: AWS/Azure/GCP ready
- **Monitoring**: Ready for integration

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL 15 or higher
- Redis 7 or higher
- Docker & Docker Compose (optional)
- npm or yarn

## 🚀 Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd Test-store/ecommerce_project
```

2. Start all services with Docker Compose:
```bash
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/health

### Manual Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd ecommerce_project/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration

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

3. Create `.env.local` file (copy from `.env.local.example`):
```bash
cp .env.local.example .env.local
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

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)
- `PUT /api/auth/change-password` - Change password (Protected)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Product Endpoints

- `GET /api/products` - Get all products (with pagination, filtering, search)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review (Protected)

### Cart Endpoints

- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart/items` - Add item to cart (Protected)
- `PUT /api/cart/items/:id` - Update cart item (Protected)
- `DELETE /api/cart/items/:id` - Remove cart item (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

### Order Endpoints

- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `GET /api/orders/myorders` - Get user orders (Protected)
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/pay` - Update order to paid (Protected)
- `PUT /api/orders/:id/deliver` - Mark as delivered (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

## 🔐 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Payment Gateways
STRIPE_SECRET_KEY=your_stripe_key
PAYPAL_CLIENT_ID=your_paypal_id

# OAuth
GOOGLE_CLIENT_ID=your_google_id
FACEBOOK_APP_ID=your_facebook_id

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:watch
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:watch
```

## 📦 Deployment

### Docker Deployment

Build and deploy using Docker:

```bash
docker-compose -f docker-compose.yml up -d
```

### Cloud Deployment

The application is ready for deployment on:
- AWS (ECS, Elastic Beanstalk)
- Azure (Container Instances, App Service)
- Google Cloud (Cloud Run, App Engine)
- Kubernetes clusters

### CI/CD Pipeline

GitHub Actions workflow is configured for:
- Automated testing on push/PR
- Docker image building
- Deployment to production (configure based on your provider)

## 🔒 Security

- HTTPS enforced in production
- Helmet.js security headers
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- SQL injection prevention via Sequelize ORM
- XSS protection
- CSRF protection ready
- Secure password hashing with bcrypt
- JWT token authentication
- Environment variable security

## 📈 Performance Optimization

- Redis caching for frequently accessed data
- Database query optimization with indexes
- Compression middleware for responses
- Image optimization with Next.js
- Code splitting and lazy loading
- Server-side rendering with Next.js
- CDN-ready static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check documentation

## 🗺️ Roadmap

- [ ] Elasticsearch integration for advanced search
- [ ] Email notification system
- [ ] SMS notifications
- [ ] Advanced analytics dashboard
- [ ] Wishlist functionality
- [ ] Product comparison
- [ ] Multi-language support
- [ ] Multi-currency support
- [ ] Advanced reporting tools
- [ ] Inventory management system
- [ ] Supplier management
- [ ] Customer loyalty program

## 📞 Contact

For more information, please contact the development team.