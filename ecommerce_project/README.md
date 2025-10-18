# E-Commerce Platform

A comprehensive, scalable e-commerce platform built with modern technologies.

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/iceakram/Test-store.git
cd Test-store/ecommerce_project

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start the application
docker-compose up -d

# Seed the database (optional)
docker-compose exec backend npm run seed
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Manual Setup

See the main [README.md](../../README.md) for detailed setup instructions.

## Test Credentials

After running the seed script:
- Admin: `admin@ecommerce.com` / `admin123`
- Customer: `customer@test.com` / `customer123`

## Features

✅ Product management with variants and inventory
✅ User authentication with role-based access
✅ Shopping cart and checkout
✅ Order management and tracking
✅ Payment integration (Stripe, PayPal)
✅ Responsive UI with Tailwind CSS
✅ Secure and scalable architecture

## Documentation

- [Deployment Guide](../../docs/DEPLOYMENT.md)
- [API Documentation](../../README.md#api-documentation)

## Tech Stack

**Backend:** Node.js, Express, PostgreSQL, Redis, Sequelize
**Frontend:** Next.js, React, Tailwind CSS, Zustand
**DevOps:** Docker, GitHub Actions
