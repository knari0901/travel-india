# Setup & Installation Guide

## Step-by-Step Backend Setup

### 1️⃣ Prerequisites

Install the following:
- **Node.js 16+** - https://nodejs.org/
- **npm** - comes with Node.js
- **One of these databases:**
  - MySQL - https://www.mysql.com/downloads/
  - MongoDB - https://www.mongodb.com/try/download/community
  - PostgreSQL - https://www.postgresql.org/download/

---

### 2️⃣ Installation Steps

```bash
# Navigate to project directory
cd c:\Users\hp\OneDrive\Desktop\incridible

# Install all npm dependencies
npm install

# This will install:
# - express (web framework)
# - sequelize (MySQL/PostgreSQL ORM)
# - mongoose (MongoDB ODM)
# - jsonwebtoken (JWT auth)
# - bcryptjs (password hashing)
# - cors, helmet, morgan (middleware)
# - And many more...
```

---

### 3️⃣ Database Configuration

#### Choose ONE database and configure:

##### Option A: MySQL

```bash
# 1. Create database
mysql -u root -p
CREATE DATABASE incredible_india;
EXIT;

# 2. Update .env
DB_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=incredible_india
```

##### Option B: MongoDB

```bash
# 1. Start MongoDB service
# Windows: Start MongoDB from Services
# Mac/Linux: brew services start mongodb-community

# 2. Update .env
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/incredible_india
```

##### Option C: PostgreSQL

```bash
# 1. Create database
createdb incredible_india

# 2. Update .env
DB_TYPE=postgresql
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=incredible_india
```

---

### 4️⃣ Environment Setup

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
# Windows: notepad .env
# Mac/Linux: nano .env

# Required changes:
# - Change DB_TYPE to your chosen database
# - Update database credentials
# - Change JWT_SECRET to something secure
# - Update CORS_ORIGIN with your frontend URL
```

---

### 5️⃣ Initialize Database

```bash
# Run database initialization script
npm run init-db

# This will:
# - Create all tables/collections
# - Add sample data (destinations)
# - Set up relationships
```

---

### 6️⃣ Start Development Server

```bash
# Start with auto-reload (nodemon)
npm run dev

# OR start normally
npm start

# You should see:
# ╔════════════════════════════════════════╗
# ║   🇮🇳 INCREDIBLE INDIA BACKEND 🇮🇳   ║
# ╚════════════════════════════════════════╝
#
# ✓ Server running at: http://0.0.0.0:5000
# ✓ Environment: development
# ✓ Database: mysql
```

---

## 🧪 Testing the API

### Using Postman

1. Download Postman - https://www.postman.com/downloads/
2. Import requests from `postman-collection.json`
3. Set environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (will be filled after login)

### Using cURL

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# 3. Get Destinations (no auth needed)
curl http://localhost:5000/api/destinations

# 4. Get Profile (with token)
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:5000/api/users/profile
```

### Using JavaScript (Fetch API)

```javascript
// Register
const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    first_name: 'John',
    last_name: 'Doe'
  })
});

const { access_token } = await registerResponse.json();

// Get Profile
const profileResponse = await fetch('http://localhost:5000/api/users/profile', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});

const { user } = await profileResponse.json();
console.log(user);
```

---

## 📁 Project Structure

```
incredible/
├── server.js                 # Main server file
├── package.json             # Dependencies
├── .env.example             # Environment template
├── config/
│   └── database.js          # Database connections
├── models/
│   ├── mysqlModels.js       # Sequelize models
│   └── mongooseModels.js    # Mongoose models
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── destinations.js      # Destinations routes
│   ├── bookings.js          # Bookings routes
│   ├── payments.js          # Payments routes
│   ├── users.js             # Users routes
│   └── reviews.js           # Reviews routes
├── middleware/
│   └── auth.js              # JWT & validation middleware
├── utils/
│   └── helpers.js           # Helper functions
└── scripts/
    ├── initDatabase.js      # Database initialization
    └── seedDatabase.js      # Sample data seeding
```

---

## 📝 Environment Variables Reference

```env
# Server
NODE_ENV=development            # development | production
PORT=5000                       # Server port
HOST=0.0.0.0                   # Server host

# Database Type
DB_TYPE=mysql                   # mysql | mongodb | postgresql

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=incredible_india

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/incredible_india

# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=incredible_india

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=7d

# Stripe (Payment Processing)
STRIPE_API_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# CORS Settings
CORS_ORIGIN=http://localhost:5501,http://localhost:3000,http://127.0.0.1:5501

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug                 # debug | info | warn | error
```

---

## 🚨 Common Issues & Solutions

### Issue: `Database connection refused`
**Solution:**
- Check if database server is running
- Verify credentials in .env
- Ensure port is correct

### Issue: `Port 5000 already in use`
**Solution:**
- Change PORT in .env to something else (e.g., 5001)
- Or kill the process using port 5000

### Issue: `npm install fails`
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: `CORS error in frontend`
**Solution:**
- Add your frontend URL to CORS_ORIGIN in .env
- Restart the server

---

## 🔄 Running Both Frontend and Backend

### Terminal 1 - Backend
```bash
cd c:\Users\hp\OneDrive\Desktop\incridible
npm run dev
# Runs on http://localhost:5000
```

### Terminal 2 - Frontend (Live Server)
```bash
# Open home.html with VS Code Live Server
# Or open in browser: http://localhost:5501
```

---

## 📊 API Health Check

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Should return:
# {
#   "status": "ok",
#   "message": "Backend is running",
#   "database": "mysql",
#   "timestamp": "2024-01-15T10:30:45.123Z"
# }
```

---

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Database installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] .env configured correctly
- [ ] Database created
- [ ] Database initialized (`npm run init-db`)
- [ ] Server started (`npm run dev`)
- [ ] Health check passing
- [ ] Can register user
- [ ] Can login
- [ ] Can fetch destinations

---

## 📚 Next Steps

1. **Connect Frontend:** See `frontend-integration.md`
2. **Add Features:** Check `BACKEND_DOCUMENTATION.md`
3. **Deploy:** See deployment guide
4. **Scale:** Optimize for production

---

## 💡 Tips

- Use Postman for API testing during development
- Check server logs for debugging
- Keep .env secrets safe (never commit to git)
- Regularly backup your database
- Monitor error logs for issues

---

For more details, see the full API documentation in `BACKEND_DOCUMENTATION.md`
