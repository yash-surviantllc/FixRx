# FixRx Backend API

**A comprehensive platform connecting consumers with trusted contractors and service providers**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7+-DC382D.svg)](https://redis.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**🚀 Status:** Core API Complete | Email Service Working | Ready for Production

---

## 📊 **Overview**

FixRx Backend API is a production-ready REST API built with TypeScript, Express, PostgreSQL, and Redis. It provides complete user management, vendor search, ratings, and invitation systems with queue-based background job processing.

### **Current Features** ✅

- 🔐 **JWT Authentication** - Secure email/password authentication
- 👥 **User Management** - Consumer & Vendor role-based access
- 🔍 **Vendor Search** - Public location-based vendor discovery
- ⭐ **Rating System** - Multi-criteria ratings (Cost, Quality, Timeliness, Professionalism)
- 📇 **Contact Management** - Import and sync phone contacts
- 📧 **Invitation System** - Email/SMS invitations with HTML templates
- ⚙️ **Background Jobs** - Queue-based email/SMS delivery with Bull
- 📊 **Database** - PostgreSQL with Prisma ORM
- 💾 **Caching** - Redis for sessions and performance

### **Coming Soon** ⏳
- Google OAuth authentication
- Phone OTP verification
- Firebase push notifications
- AWS S3 file uploads

---

## 🛠️ **Tech Stack**

| Component | Technology |
|-----------|------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js + TypeScript |
| **Database** | PostgreSQL 15+ |
| **ORM** | Prisma |
| **Cache** | Redis 7+ |
| **Queue** | Bull Queue |
| **Authentication** | JWT |
| **Validation** | Joi |
| **Email** | SendGrid |
| **SMS** | Twilio |
| **Logging** | Winston |
| **Container** | Docker + Docker Compose |

---

## 📋 **Prerequisites**

Before setting up the project, ensure you have:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 15 or higher ([Download](https://www.postgresql.org/download/))
- **Redis** 7 or higher ([Download](https://redis.io/download))
- **Docker** & **Docker Compose** (optional, recommended) ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

---

## 🚀 **Quick Start**

### **Option 1: Docker Setup (Recommended)**

This is the easiest way to get started. Docker will handle PostgreSQL and Redis automatically.

```bash
# 1. Clone the repository
git clone https://github.com/FixRX/Backend.git
cd Backend

# 2. Create environment file
cp .env.example .env
# Edit .env with your settings (see Configuration section)

# 3. Start all services (PostgreSQL, Redis, API)
docker-compose up -d

# 4. Run database migrations
docker-compose exec api npx prisma migrate dev

# 5. Generate Prisma Client
docker-compose exec api npx prisma generate

# 6. View logs (optional)
docker-compose logs -f api
```

**🎉 Your API is now running at:** `http://localhost:3000`

**Health Check:** `http://localhost:3000/health`

---

### **Option 2: Local Development (Without Docker)**

If you prefer running services locally:

#### **Step 1: Install Dependencies**

```bash
# Clone repository
git clone https://github.com/FixRX/Backend.git
cd Backend

# Install npm packages
npm install
```

#### **Step 2: Start PostgreSQL & Redis**

**Using Docker for databases only:**
```bash
# Start PostgreSQL
docker run -d \
  --name fixrx-postgres \
  -e POSTGRES_DB=fixrx \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Start Redis
docker run -d \
  --name fixrx-redis \
  -p 6379:6379 \
  redis:7-alpine
```

**OR install PostgreSQL and Redis locally:**
- PostgreSQL: Follow [official guide](https://www.postgresql.org/download/)
- Redis: Follow [official guide](https://redis.io/docs/getting-started/installation/)

#### **Step 3: Configure Environment**

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your database credentials
# Minimum required:
# - DATABASE_URL
# - JWT_SECRET
# - JWT_REFRESH_SECRET
```

#### **Step 4: Setup Database**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

#### **Step 5: Start Development Server**

```bash
npm run dev
```

**🎉 Your API is now running at:** `http://localhost:3000`

---

## ⚙️ **Configuration**

### **Environment Variables**

Create a `.env` file in the root directory. Here are the required variables:

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=development
PORT=3000
API_VERSION=v1

# ============================================
# DATABASE (PostgreSQL)
# ============================================
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fixrx?schema=public"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fixrx
DB_USER=postgres
DB_PASSWORD=postgres

# ============================================
# REDIS
# ============================================
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# ============================================
# JWT AUTHENTICATION
# ============================================
# Generate secure keys: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters
JWT_REFRESH_EXPIRES_IN=30d

# ============================================
# SENDGRID (Email Service)
# ============================================
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=FixRx App

# ============================================
# TWILIO (SMS Service)
# ============================================
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# ============================================
# OPTIONAL (For Future Features)
# ============================================
# Google OAuth (Coming Soon)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Firebase (Coming Soon)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# AWS S3 (Coming Soon)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_REGION=us-east-1
```

### **Generate Secure JWT Secrets**

```bash
# Run this command twice to generate two different keys
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use the first output for `JWT_SECRET` and the second for `JWT_REFRESH_SECRET`.

---

## 📁 **Project Structure**

```
backend/
├── src/
│   ├── config/
│   │   └── environment.ts       # Environment variable configuration
│   ├── controllers/             # Request handlers
│   │   ├── authController.ts    # Authentication
│   │   ├── userController.ts    # User management
│   │   ├── consumerController.ts # Consumer features
│   │   ├── vendorController.ts   # Vendor features
│   │   ├── ratingController.ts   # Rating system
│   │   ├── contactController.ts  # Contact management
│   │   └── invitationController.ts # Invitations
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   ├── validation.ts        # Joi validation schemas
│   │   └── errorHandler.ts      # Error handling
│   ├── routes/                  # API route definitions
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── consumers.ts
│   │   ├── vendors.ts
│   │   ├── ratings.ts
│   │   ├── contacts.ts
│   │   └── invitations.ts
│   ├── services/                # Business logic
│   │   ├── email.service.ts     # SendGrid email service
│   │   ├── sms.service.ts       # Twilio SMS service
│   │   ├── queue.ts             # Bull queue service
│   │   └── job-processors.ts    # Background job handlers
│   ├── utils/
│   │   ├── logger.ts            # Winston logger
│   │   └── prisma.ts            # Prisma client
│   └── server.ts                # Application entry point
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── .env.example                 # Example environment file
├── .gitignore
├── docker-compose.yml           # Docker services configuration
├── Dockerfile                   # Container build instructions
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📚 **API Endpoints**

### **Base URL**
```
http://localhost:3000/api/v1
```

### **Core Endpoints (21 Tested)**

| Category | Endpoint | Method | Auth | Description |
|----------|----------|--------|------|-------------|
| **Health** | `/health` | GET | No | API health check |
| **Auth** | `/auth/register` | POST | No | Register new user |
| **Auth** | `/auth/login` | POST | No | User login |
| **Auth** | `/auth/logout` | POST | Yes | User logout |
| **Users** | `/users/me` | GET | Yes | Get current user |
| **Users** | `/users/me` | PUT | Yes | Update user profile |
| **Consumers** | `/consumers/profile` | POST | Yes | Create consumer profile |
| **Consumers** | `/consumers/profile/me` | GET | Yes | Get consumer profile |
| **Consumers** | `/consumers/dashboard` | GET | Yes | Get dashboard data |
| **Consumers** | `/consumers/location` | PUT | Yes | Update location |
| **Vendors** | `/vendors/profile` | POST | Yes | Create vendor profile |
| **Vendors** | `/vendors/profile/me` | GET | Yes | Get vendor profile |
| **Vendors** | `/vendors/search` | GET | **No** | Search vendors (public) |
| **Ratings** | `/ratings` | POST | Yes | Create rating (consumer) |
| **Ratings** | `/ratings/vendor/:id` | GET | **No** | Get vendor ratings (public) |
| **Contacts** | `/contacts/import` | POST | Yes | Import contacts |
| **Contacts** | `/contacts` | GET | Yes | List contacts |
| **Invitations** | `/invitations/send` | POST | Yes | Send email invitation |
| **Invitations** | `/invitations/send` | POST | Yes | Send SMS invitation |

### **Test with Postman**

Import the Postman collection: `FixRx-API-Collection.postman_collection.json`

```bash
# Collection includes:
- Auto token management
- Pre-configured requests
- Test scripts
- Environment variables
```

---

## 🗄️ **Database Management**

### **Prisma Commands**

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Open Prisma Studio (Database GUI)
npx prisma studio
```

### **View Database**

Prisma Studio provides a visual interface to view and edit database records:

```bash
npm run db:studio
```

Access at: `http://localhost:5555`

### **Database Schema**

Key models:
- **User** - Authentication and base user data
- **Consumer** - Consumer profiles and preferences
- **Vendor** - Vendor business profiles
- **Rating** - Multi-criteria vendor ratings
- **Contact** - Imported phone contacts
- **Invitation** - Email/SMS invitation tracking
- **Connection** - User-to-user relationships

---

## 🐳 **Docker Commands**

### **Development**

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart api

# Execute command in container
docker-compose exec api npm run db:studio
```

### **Docker Compose Services**

The `docker-compose.yml` file includes:

- **PostgreSQL** - Database (port 5432)
- **Redis** - Cache (port 6379)
- **API** - Backend application (port 3000)

### **Production Build**

```bash
# Build production image
docker build -t fixrx-backend:latest .

# Run production container
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name fixrx-api \
  fixrx-backend:latest
```

---

## 🧪 **Testing**

### **Manual Testing with cURL**

```bash
# Health Check
curl http://localhost:3000/health

# Register User
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "role": "CONSUMER"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

### **Using Postman Collection**

1. Import `FixRx-API-Collection.postman_collection.json`
2. Set collection variable: `baseUrl = http://localhost:3000/api/v1`
3. Run "Register Consumer" request
4. Run "Login" request (token auto-saved)
5. Test other endpoints

---

## 🔧 **Development**

### **Available Scripts**

```bash
# Start development server (with auto-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio

# Code quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### **Environment Modes**

- **Development** (`NODE_ENV=development`)
  - Hot reload enabled
  - Detailed error messages
  - Query logging enabled

- **Production** (`NODE_ENV=production`)
  - Optimized performance
  - Error logging only
  - Security headers enabled

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Port 3000 already in use**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

#### **Database connection failed**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Verify DATABASE_URL in .env matches your setup
# Reset database
npx prisma migrate reset
```

#### **Redis connection failed**
```bash
# Check if Redis is running
docker ps | grep redis

# Verify REDIS_URL in .env
# Restart Redis
docker restart fixrx-redis
```

#### **Prisma Client not generated**
```bash
npx prisma generate
```

#### **Emails not sending**
- Verify SendGrid API key is correct
- Check `SENDGRID_FROM_EMAIL` is verified in SendGrid dashboard
- View terminal logs for error details

---

## 📊 **Monitoring**

### **Health Check**
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-01T18:00:00.000Z",
  "uptime": 12345,
  "database": "connected",
  "redis": "connected"
}
```

### **Logs**

Logs are written to console using Winston:

```bash
# View live logs
docker-compose logs -f api

# Or in local development
npm run dev
```

### **Database Monitoring**

Use Prisma Studio for visual database inspection:
```bash
npx prisma studio
```

---

## 🔒 **Security**

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **Input Validation** - Joi schema validation
- ✅ **SQL Injection Prevention** - Prisma ORM
- ✅ **CORS** - Configured allowed origins
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **Helmet** - Security headers
- ✅ **Environment Variables** - Sensitive data protection

---

## 🚀 **Deployment**

### **Environment Setup**

1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure production database
4. Set up Redis instance
5. Configure email/SMS services
6. Enable HTTPS

### **Production Checklist**

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL/TLS certificates installed
- [ ] Monitoring and logging set up
- [ ] Backup strategy implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Health checks enabled

---

## 🤝 **Contributing**

We welcome contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License.

---

## 📞 **Support**

- **Issues:** [GitHub Issues](https://github.com/FixRX/Backend/issues)
- **Documentation:** See `PROJECT_STATUS.md` and `FRIDAY_IMPLEMENTATION_GUIDE.md`
- **Database GUI:** `npx prisma studio`

---

## 📅 **Roadmap**

### **Current** ✅
- Core API complete
- Email service working
- 21 tested endpoints
- Docker support

### **Next Phase** (Oct 4, 2025)
- Google OAuth authentication
- Phone OTP verification
- Firebase push notifications
- AWS S3 file uploads

---

**Built with ❤️ by the FixRx Team**

⭐ [Star us on GitHub](https://github.com/FixRX/Backend) • 🐛 [Report Bug](https://github.com/FixRX/Backend/issues) • 💡 [Request Feature](https://github.com/FixRX/Backend/issues)
