# 🇮🇳 Incredible India - Backend API

A comprehensive RESTful API backend for the Incredible India travel booking platform, built with Node.js/Express and supporting multiple databases.

---

## ✨ Features

✅ **Multiple Database Support**
- MySQL with Sequelize ORM
- MongoDB with Mongoose ODM
- PostgreSQL with Sequelize ORM

✅ **Authentication & Security**
- JWT-based authentication
- Password hashing with bcryptjs
- Refresh token mechanism
- Role-based access control ready

✅ **Complete API Features**
- User authentication & profiles
- Destination management
- Booking system
- Payment integration (Stripe-ready)
- Review & rating system
- Admin capabilities

✅ **Production Ready**
- Error handling middleware
- Rate limiting
- CORS support
- Request validation
- Comprehensive logging
- Security headers (Helmet)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- One of: MySQL, MongoDB, or PostgreSQL

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
npm run init-db

# Start development server
npm run dev
```

Server runs at: **http://localhost:5000**

---

## 📚 Documentation

- [Full API Documentation](./BACKEND_DOCUMENTATION.md) - Complete endpoint reference
- [Setup Guide](./SETUP_GUIDE.md) - Step-by-step installation
- [Frontend Integration](./frontend-integration.md) - Connect your HTML frontend

---

## 🏗️ Project Structure

```
├── server.js                 # Main Express server
├── config/
│   └── database.js          # Database connections
├── models/
│   ├── mysqlModels.js       # Sequelize models
│   └── mongooseModels.js    # Mongoose models
├── routes/
│   ├── auth.js              # Authentication
│   ├── destinations.js      # Travel packages
│   ├── bookings.js          # Reservations
│   ├── payments.js          # Transactions
│   ├── users.js             # User profiles
│   └── reviews.js           # Ratings
├── middleware/
│   └── auth.js              # JWT & validation
├── utils/
│   └── helpers.js           # Utilities
└── scripts/
    └── initDatabase.js      # DB initialization
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Destinations
- `GET /api/destinations` - List all
- `GET /api/destinations/:id` - Get single
- `POST /api/destinations` - Create (admin)
- `PUT /api/destinations/:id` - Update (admin)
- `DELETE /api/destinations/:id` - Delete (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `POST /api/bookings/:id/cancel` - Cancel booking

### Payments
- `POST /api/payments/create-intent` - Create payment
- `POST /api/payments/:id/confirm` - Confirm payment
- `GET /api/payments/:booking_id` - Get payment details
- `POST /api/payments/:id/refund` - Refund payment

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password
- `GET /api/users/stats` - User statistics

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/destination/:id` - Get destination reviews
- `GET /api/reviews/user` - Get user reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

---

## ⚙️ Environment Configuration

```env
# Server
NODE_ENV=development
PORT=5000

# Database (mysql | mongodb | postgresql)
DB_TYPE=mysql

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:5501,http://localhost:3000
```

See `.env.example` for full configuration options.

---

## 🗄️ Database Setup

### MySQL
```sql
CREATE DATABASE incredible_india;
```

### MongoDB
```
mongod
```

### PostgreSQL
```sql
CREATE DATABASE incredible_india;
```

---

## 🧪 Testing

```bash
# Using Postman
# Import API endpoints and test each route

# Using cURL
curl http://localhost:5000/api/health

# Using fetch (JavaScript)
fetch('http://localhost:5000/api/destinations')
  .then(r => r.json())
  .then(console.log)
```

---

## 🎯 Features to Implement

- [ ] Wishlist management
- [ ] Itinerary builder
- [ ] Group bookings
- [ ] Loyalty rewards
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics & reporting
- [ ] WebSocket real-time updates
- [ ] Multi-language support
- [ ] Video tours
- [ ] Travel insurance
- [ ] Social sharing
- [ ] Advanced search filters
- [ ] Payment gateway integration
- [ ] Mobile app API

---

## 📦 Dependencies

**Core**
- express - Web framework
- cors - Cross-Origin Resource Sharing
- helmet - Security headers
- morgan - HTTP logger

**Database**
- sequelize - ORM for MySQL/PostgreSQL
- mongoose - ODM for MongoDB
- mysql2 - MySQL driver
- pg - PostgreSQL driver

**Authentication**
- jsonwebtoken - JWT tokens
- bcryptjs - Password hashing

**Validation & Middleware**
- express-validator - Input validation
- express-rate-limit - Rate limiting

**Utilities**
- dotenv - Environment variables
- stripe - Payment processing
- multer - File uploads
- compression - Response compression

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Change PORT in .env or kill process |
| Database connection failed | Check credentials and ensure DB is running |
| CORS error | Add frontend URL to CORS_ORIGIN in .env |
| JWT token error | Token expired - use refresh endpoint |
| Module not found | Run `npm install` again |

---

## 🔒 Security

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication
- ✅ Rate limiting enabled
- ✅ CORS configured
- ✅ Security headers with Helmet
- ✅ Input validation
- ✅ Environment secrets protection

---

## 📊 Sample Data

On database initialization, the following sample destinations are added:
- Taj Mahal, Agra (₹5,000/night)
- Kerala Backwaters (₹4,500/night)
- Goa Beaches (₹3,500/night)
- Rajasthan Desert Safari (₹2,500/night)
- Kashmir Valley (₹6,000/night)
- Jaipur City Palace (₹3,000/night)
- Himachal Hillstations (₹2,800/night)
- Mumbai City Tour (₹4,000/night)

---

## 💻 Development

```bash
# Install dependencies
npm install

# Development with auto-reload
npm run dev

# Production build
npm start

# Database initialization
npm run init-db

# Database seeding
npm run seed-db
```

---

## 📄 License

MIT License - feel free to use this project for commercial or personal use.

---

## 👨‍💻 Support

For issues or questions:
1. Check the documentation files
2. Review the API examples
3. Check server logs for errors
4. Create an issue in the repository

---

## 🚀 Deployment

Ready for deployment to:
- Heroku
- Railway
- Render
- AWS Lambda
- Google Cloud
- Azure App Service

See deployment guides in the docs folder.

---

**Made with ❤️ for incredible travel experiences in India**
