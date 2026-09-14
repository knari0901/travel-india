# Incredible India Backend API - Complete Documentation

## 🇮🇳 Project Overview

A comprehensive RESTful API for the "Incredible India" travel booking platform. Built with Node.js and Express, supporting multiple databases: MySQL, MongoDB, and PostgreSQL.

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Database Setup](#database-setup)
- [Future Features](#future-features)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MySQL / MongoDB / PostgreSQL installed
- Git

### Installation

```bash
# Clone the repository
cd c:\Users\hp\OneDrive\Desktop\incridible

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# Then initialize database
npm run init-db

# Start development server
npm run dev
```

Server will run at: **http://localhost:5000**

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Server
NODE_ENV=development
PORT=5000
HOST=0.0.0.0

# Database (mysql | mongodb | postgresql)
DB_TYPE=mysql

# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=incredible_india

# MongoDB
MONGODB_URI=mongodb://localhost:27017/incredible_india

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=incredible_india

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=7d

# Stripe (Payment)
STRIPE_API_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# CORS
CORS_ORIGIN=http://localhost:5501,http://localhost:3000
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected endpoints require JWT token:
```
Authorization: Bearer <access_token>
```

---

### 1. **Authentication Endpoints** (`/auth`)

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+91-9876543210"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "message": "Login successful",
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": { ... }
}
```

#### Refresh Token
```
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGc..."
}

Response: 200 OK
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Logged out successfully"
}
```

---

### 2. **Destinations Endpoints** (`/destinations`)

#### Get All Destinations
```
GET /destinations?state=Goa&min_price=1000&max_price=5000&search=beach

Query Parameters:
- state: Filter by state (optional)
- min_price: Minimum price per night (optional)
- max_price: Maximum price per night (optional)
- search: Search destination name (optional)

Response: 200 OK
{
  "destinations": [
    {
      "id": "dest-uuid",
      "name": "Goa Beaches",
      "description": "...",
      "state": "Goa",
      "price_per_night": 3500,
      "max_guests": 4,
      "image_url": "...",
      "rating": 4.5,
      "is_available": true
    }
  ],
  "total": 5
}
```

#### Get Single Destination
```
GET /destinations/:id

Response: 200 OK
{
  "destination": { ... }
}
```

#### Create Destination (Admin)
```
POST /destinations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Destination",
  "description": "Description",
  "state": "State",
  "price_per_night": 5000,
  "max_guests": 4,
  "image_url": "url",
  "amenities": ["WiFi", "AC", "Breakfast"]
}

Response: 201 Created
```

#### Update Destination
```
PUT /destinations/:id
Authorization: Bearer <token>
Content-Type: application/json

{ "name": "Updated name", ... }

Response: 200 OK
```

#### Delete Destination
```
DELETE /destinations/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Destination deleted successfully"
}
```

---

### 3. **Bookings Endpoints** (`/bookings`)

#### Create Booking
```
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "destination_id": "dest-uuid",
  "check_in_date": "2024-12-01T14:00:00",
  "check_out_date": "2024-12-05T10:00:00",
  "num_guests": 2,
  "special_requests": "Late checkout requested"
}

Response: 201 Created
{
  "message": "Booking created successfully",
  "booking": { ... },
  "nights": 4,
  "total_price": 20000
}
```

#### Get User Bookings
```
GET /bookings
Authorization: Bearer <token>

Response: 200 OK
{
  "bookings": [ ... ],
  "total": 3
}
```

#### Get Booking Details
```
GET /bookings/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "booking": { ... }
}
```

#### Update Booking
```
PUT /bookings/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "num_guests": 3,
  "special_requests": "Updated requests"
}

Response: 200 OK
```

#### Cancel Booking
```
POST /bookings/:id/cancel
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Booking cancelled successfully"
}
```

---

### 4. **Payments Endpoints** (`/payments`)

#### Create Payment Intent
```
POST /payments/create-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "booking_id": "booking-uuid",
  "payment_method": "credit_card"
}

Response: 201 Created
{
  "message": "Payment intent created",
  "payment": { ... },
  "client_secret": "test_secret_xxx"
}
```

#### Confirm Payment
```
POST /payments/:id/confirm
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Payment confirmed successfully",
  "payment": { ... }
}
```

#### Get Payment
```
GET /payments/:booking_id
Authorization: Bearer <token>

Response: 200 OK
{
  "payment": { ... }
}
```

#### Refund Payment
```
POST /payments/:id/refund
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Payment refunded successfully"
}
```

---

### 5. **User Endpoints** (`/users`)

#### Get Profile
```
GET /users/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+91-9876543210",
    "bio": "Travel enthusiast"
  }
}
```

#### Update Profile
```
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Updated",
  "phone": "+91-9876543210",
  "bio": "Updated bio",
  "profile_picture": "url"
}

Response: 200 OK
```

#### Change Password
```
POST /users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_password": "old_password",
  "new_password": "new_password"
}

Response: 200 OK
```

#### Get User Stats
```
GET /users/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "total_bookings": 5,
  "total_reviews": 2,
  "member_since": "2024-01-01"
}
```

#### Delete Account
```
DELETE /users/account
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Account deleted successfully"
}
```

---

### 6. **Reviews Endpoints** (`/reviews`)

#### Create Review
```
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "destination_id": "dest-uuid",
  "rating": 4,
  "title": "Amazing Experience!",
  "comment": "Great place to visit...",
  "photos": ["url1", "url2"]
}

Response: 201 Created
```

#### Get Destination Reviews
```
GET /reviews/destination/:destination_id?limit=10&offset=0

Response: 200 OK
{
  "reviews": [ ... ],
  "average_rating": 4.5,
  "total": 10
}
```

#### Get User Reviews
```
GET /reviews/user
Authorization: Bearer <token>

Response: 200 OK
{
  "reviews": [ ... ],
  "total": 3
}
```

#### Update Review
```
PUT /reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "title": "Updated title",
  "comment": "Updated comment"
}

Response: 200 OK
```

#### Delete Review
```
DELETE /reviews/:id
Authorization: Bearer <token>

Response: 200 OK
```

#### Like Review
```
POST /reviews/:id/like

Response: 200 OK
{
  "message": "Review liked",
  "review": { ... }
}
```

---

## 🗄️ Database Setup

### MySQL Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE incredible_india;
USE incredible_india;

# Update .env
DB_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=incredible_india

# Initialize
npm run init-db
```

### MongoDB Setup

```bash
# Start MongoDB
mongod

# Update .env
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/incredible_india

# Initialize
npm run init-db
```

### PostgreSQL Setup

```bash
# Create database
createdb incredible_india

# Update .env
DB_TYPE=postgresql
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=incredible_india

# Initialize
npm run init-db
```

---

## 🎯 Future Features to Implement

1. **Wishlist System** - Save favorite destinations
2. **Itinerary Builder** - Multi-destination trip planning
3. **Group Bookings** - Special rates for groups
4. **Loyalty Program** - Rewards & discounts
5. **Advanced Search** - AI-powered recommendations
6. **Email Notifications** - Booking confirmations
7. **Admin Dashboard** - Manage content
8. **Analytics** - Revenue tracking
9. **WebSocket Integration** - Real-time updates
10. **Multi-language Support** - Localization
11. **Video Tours** - 360° virtual tours
12. **Travel Insurance** - Optional insurance addon
13. **Social Sharing** - Share on social media
14. **Rating System** - Star ratings and reviews
15. **Payment Gateway** - Multiple payment options

---

## 🐛 Troubleshooting

### Database Connection Error
- Check .env file credentials
- Ensure database server is running
- Verify network connectivity

### JWT Token Error
- Token may be expired - use refresh endpoint
- Check JWT_SECRET in .env
- Verify Authorization header format

### CORS Error
- Add your frontend URL to CORS_ORIGIN in .env
- Restart server after changes

### Port Already in Use
- Change PORT in .env
- Or kill existing process: `lsof -i :5000`

---

## 📞 Support

For issues or questions, please create an issue in the repository.

---

## 📄 License

MIT License - see LICENSE file for details
