# Getting Started Guide

## Prerequisites Check

Before you begin, ensure you have the following installed:

- [ ] **Node.js** (version 18 or higher)
  ```bash
  node --version  # Should show v18.x.x or higher
  ```

- [ ] **npm** (comes with Node.js)
  ```bash
  npm --version
  ```

- [ ] **Docker** (optional, but recommended)
  ```bash
  docker --version
  docker-compose --version
  ```

- [ ] **PostgreSQL** (if not using Docker)
  ```bash
  psql --version  # Should show 15.x or higher
  ```

- [ ] **Redis** (if not using Docker)
  ```bash
  redis-cli --version  # Should show 7.x or higher
  ```

## Installation Methods

### Method 1: Docker (Recommended for Quick Start)

This is the easiest way to get started with all services running.

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Test-store/ecommerce_project
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Verify services are running**
   ```bash
   docker-compose ps
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

5. **View logs**
   ```bash
   docker-compose logs -f
   ```

6. **Stop services**
   ```bash
   docker-compose down
   ```

### Method 2: Manual Installation

For development or when you want more control.

#### Step 1: Set Up PostgreSQL

1. **Install PostgreSQL 15**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql-15

   # macOS (Homebrew)
   brew install postgresql@15
   ```

2. **Create database**
   ```bash
   # Access PostgreSQL
   sudo -u postgres psql

   # Create database
   CREATE DATABASE ecommerce_db;
   
   # Create user (optional)
   CREATE USER ecommerce_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;
   
   # Exit
   \q
   ```

#### Step 2: Set Up Redis

1. **Install Redis**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install redis-server

   # macOS (Homebrew)
   brew install redis
   ```

2. **Start Redis**
   ```bash
   # Ubuntu/Debian
   sudo systemctl start redis-server

   # macOS
   brew services start redis
   ```

3. **Verify Redis is running**
   ```bash
   redis-cli ping  # Should return PONG
   ```

#### Step 3: Set Up Backend

1. **Navigate to backend directory**
   ```bash
   cd ecommerce_project/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env file**
   ```bash
   # Use your preferred editor
   nano .env
   # or
   vim .env
   # or
   code .env
   ```

   Update these critical values:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ecommerce_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   REDIS_URL=redis://localhost:6379
   
   JWT_SECRET=your-super-secret-key-change-this
   
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the backend server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

6. **Verify backend is running**
   - Open http://localhost:5000/health
   - Should see: `{"status":"OK","timestamp":"..."}`

#### Step 4: Set Up Frontend

1. **Open a new terminal**

2. **Navigate to frontend directory**
   ```bash
   cd ecommerce_project/frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create environment file**
   ```bash
   cp .env.local.example .env.local
   ```

5. **Edit .env.local file**
   ```bash
   nano .env.local
   ```

   Update:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Open http://localhost:3000
   - You should see the e-commerce homepage

## Verification Steps

### 1. Check Backend Health

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"OK","timestamp":"2025-10-18T..."}
```

### 2. Check Database Connection

Look for this in backend logs:
```
PostgreSQL Connected Successfully
Database synchronized
```

### 3. Check Redis Connection

Look for this in backend logs:
```
Redis Client Connected
```

### 4. Test API Endpoints

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Get products:**
```bash
curl http://localhost:5000/api/products
```

### 5. Check Frontend

1. Open http://localhost:3000
2. Click on "Register" or "Login"
3. Navigate through the pages

## Troubleshooting

### Issue: Backend won't start

**Error: "Unable to connect to database"**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

**Error: "Redis Client Error"**
- Check Redis is running: `redis-cli ping`
- Start Redis: `sudo systemctl start redis-server`

### Issue: Frontend won't start

**Error: "Module not found"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**Error: "Port 3000 already in use"**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Issue: Database connection errors

1. **Check PostgreSQL is running**
   ```bash
   sudo systemctl status postgresql
   ```

2. **Verify credentials**
   ```bash
   psql -U postgres -d ecommerce_db
   ```

3. **Check .env file**
   - Ensure no spaces around `=`
   - Verify DB_PASSWORD matches PostgreSQL user password

### Issue: CORS errors in browser

1. **Check backend CORS_ORIGIN in .env**
   ```env
   CORS_ORIGIN=http://localhost:3000
   ```

2. **Restart backend after changing .env**

## Next Steps

### 1. Create Admin User

After registering a regular user, you can manually promote them to admin:

```sql
-- Connect to database
psql -U postgres -d ecommerce_db

-- Update user role
UPDATE "Users" SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 2. Add Sample Products

Use the API or admin panel to add products:

```bash
# Get auth token first by logging in
TOKEN="your-jwt-token"

curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Product",
    "description": "This is a sample product",
    "price": 99.99,
    "sku": "SKU001",
    "categoryId": "category-uuid",
    "countInStock": 100
  }'
```

### 3. Configure Payment Gateway

1. Sign up for Stripe account: https://stripe.com
2. Get API keys from Stripe dashboard
3. Update `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   ```
4. Update frontend `.env.local`:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
   ```

### 4. Configure Email Service

1. Get SMTP credentials (Gmail, SendGrid, etc.)
2. Update backend `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

## Development Workflow

### Making Changes

1. **Backend changes**
   - Edit files in `backend/`
   - Server auto-reloads with `npm run dev`
   - Test API with curl or Postman

2. **Frontend changes**
   - Edit files in `frontend/`
   - Next.js auto-reloads on save
   - Changes appear in browser

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Production Deployment

See [DEPLOYMENT.md](./ecommerce_project/DEPLOYMENT.md) for detailed deployment instructions for:
- AWS (ECS, Elastic Beanstalk)
- Azure (Container Instances)
- Google Cloud (Cloud Run)
- Kubernetes

## Getting Help

1. **Check Documentation**
   - [README.md](./README.md) - Overview
   - [API_DOCUMENTATION.md](./ecommerce_project/API_DOCUMENTATION.md) - API reference
   - [DEPLOYMENT.md](./ecommerce_project/DEPLOYMENT.md) - Deployment guide
   - [SECURITY.md](./ecommerce_project/SECURITY.md) - Security guidelines

2. **Common Issues**
   - Check logs for error messages
   - Verify environment variables
   - Ensure all services are running

3. **Support**
   - Create an issue in the repository
   - Check existing documentation
   - Contact the development team

## Success Checklist

- [ ] PostgreSQL is running
- [ ] Redis is running
- [ ] Backend server started successfully
- [ ] Frontend development server started
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:5000/health
- [ ] Can register a new user
- [ ] Can login
- [ ] Can view products
- [ ] No errors in browser console
- [ ] No errors in backend logs

Congratulations! Your e-commerce platform is now running! 🎉
