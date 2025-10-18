# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "data": {},
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": []
}
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer",
  "token": "jwt_token"
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer",
  "token": "jwt_token"
}
```

#### Get Profile
```http
GET /api/auth/profile
```
**Protected Route**

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "role": "customer",
  "isVerified": true
}
```

### Products

#### Get All Products
```http
GET /api/products?page=1&limit=12&category=uuid&search=query&sortBy=price-asc
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `category` (optional): Filter by category ID
- `search` (optional): Search in name, description, tags
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `featured` (optional): Filter featured products (true/false)
- `sortBy` (optional): Sort options (price-asc, price-desc, name-asc, name-desc, rating, newest)

**Response:**
```json
{
  "products": [],
  "page": 1,
  "pages": 5,
  "total": 50
}
```

#### Get Product by ID
```http
GET /api/products/:id
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "sku": "SKU123",
  "countInStock": 10,
  "category": {
    "id": "uuid",
    "name": "Category Name"
  },
  "reviews": []
}
```

#### Create Product
```http
POST /api/products
```
**Protected Route - Admin Only**

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "shortDescription": "Short desc",
  "price": 99.99,
  "comparePrice": 149.99,
  "sku": "SKU123",
  "categoryId": "uuid",
  "countInStock": 100,
  "images": ["url1", "url2"],
  "tags": ["tag1", "tag2"]
}
```

#### Add Product Review
```http
POST /api/products/:id/reviews
```
**Protected Route**

**Request Body:**
```json
{
  "rating": 5,
  "title": "Great product!",
  "comment": "This is an excellent product..."
}
```

### Shopping Cart

#### Get Cart
```http
GET /api/cart
```
**Protected Route**

**Response:**
```json
{
  "id": "uuid",
  "items": [
    {
      "id": "uuid",
      "quantity": 2,
      "product": {
        "id": "uuid",
        "name": "Product Name",
        "price": 99.99,
        "thumbnail": "image_url"
      }
    }
  ]
}
```

#### Add to Cart
```http
POST /api/cart/items
```
**Protected Route**

**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 1
}
```

#### Update Cart Item
```http
PUT /api/cart/items/:id
```
**Protected Route**

**Request Body:**
```json
{
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /api/cart/items/:id
```
**Protected Route**

#### Clear Cart
```http
DELETE /api/cart
```
**Protected Route**

### Orders

#### Create Order
```http
POST /api/orders
```
**Protected Route**

**Request Body:**
```json
{
  "orderItems": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA",
    "phone": "1234567890"
  },
  "paymentMethod": "stripe",
  "shippingCost": 10.00,
  "taxAmount": 5.00
}
```

**Response:**
```json
{
  "id": "uuid",
  "orderNumber": "ORD-1234567890-ABC123",
  "status": "pending",
  "subtotal": 199.98,
  "tax": 5.00,
  "shippingCost": 10.00,
  "total": 214.98,
  "items": []
}
```

#### Get Order by ID
```http
GET /api/orders/:id
```
**Protected Route**

#### Get My Orders
```http
GET /api/orders/myorders?page=1&limit=10
```
**Protected Route**

#### Get All Orders
```http
GET /api/orders?status=pending&page=1&limit=20
```
**Protected Route - Admin Only**

#### Update Order to Paid
```http
PUT /api/orders/:id/pay
```
**Protected Route**

**Request Body:**
```json
{
  "paymentId": "stripe_payment_id",
  "status": "paid"
}
```

#### Update Order Status
```http
PUT /api/orders/:id/status
```
**Protected Route - Admin Only**

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}
```

## Status Codes

- `200` OK - Request successful
- `201` Created - Resource created successfully
- `400` Bad Request - Invalid request data
- `401` Unauthorized - Authentication required
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource not found
- `500` Internal Server Error - Server error

## Rate Limiting

- Authentication endpoints: 5 requests per 15 minutes
- General API endpoints: 100 requests per 15 minutes
- Admin endpoints: 200 requests per 15 minutes

## Pagination

All list endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default varies by endpoint)

Response includes:
```json
{
  "data": [],
  "page": 1,
  "pages": 10,
  "total": 100
}
```
