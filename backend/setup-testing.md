# FixRx Backend Testing Setup Guide

## Prerequisites

Before testing the FixRx backend, ensure you have the following installed:

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v13 or higher)
3. **Redis** (v6 or higher)
4. **Git** (for version control)

## Quick Setup for Testing

### 1. Install Dependencies

The dependencies are already installed, but if you need to reinstall:

```bash
npm install
```

### 2. Database Setup

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL and Redis using Docker
docker-compose up -d postgres redis
```

#### Option B: Local Installation
- Install PostgreSQL locally and create a database named `fixrx_test_db`
- Install Redis locally and start the service
- Update the `.env` file with your local database credentials

### 3. Environment Configuration

The `.env` file has been created with test configuration. Update the following if needed:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/fixrx_test_db?schema=public"
DB_USER=postgres
DB_PASSWORD=password

# Redis Configuration
REDIS_URL=redis://localhost:6379
```

### 4. Database Migration

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate
```

### 5. Start the Server

```bash
# Start in development mode
npm run dev
```

The server will start on `http://localhost:3000`

## Testing Options

### Option 1: Automated API Testing (Recommended)

Run the comprehensive automated test suite:

```bash
npm run test:api
```

This will:
- Test all API endpoints
- Create test users (consumer and vendor)
- Verify authentication flows
- Test CRUD operations
- Provide detailed results and tokens for manual testing

### Option 2: Manual Testing with HTTP Files

Use the `tests/api-tests.http` file with REST Client extensions:

1. **VS Code**: Install "Thunder Client" or "REST Client" extension
2. **Postman**: Import the HTTP file
3. **Insomnia**: Import the HTTP file

### Option 3: Manual Testing with curl

Example commands:

```bash
# Health check
curl http://localhost:3000/health

# Register a consumer
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "CONSUMER"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

## Test Coverage

The testing suite covers:

### ✅ Core Functionality
- [x] Health checks and server status
- [x] User registration (Consumer/Vendor)
- [x] Authentication (Login/Logout)
- [x] JWT token management
- [x] User profile management

### ✅ Vendor Features
- [x] Vendor search (public)
- [x] Vendor categories
- [x] Featured vendors
- [x] Nearby vendor search
- [x] Vendor profile management
- [x] Business information updates

### ✅ Consumer Features
- [x] Consumer profile management
- [x] Preferences and settings
- [x] Location-based features

### ✅ Rating System
- [x] Create ratings (4-category system)
- [x] Rating retrieval
- [x] Rating management

### ✅ Invitation System
- [x] SMS invitations
- [x] Email invitations
- [x] Bulk invitations
- [x] Invitation tracking

### ✅ Contact Management
- [x] Contact import
- [x] Contact synchronization
- [x] Registration detection

### 🔄 Advanced Features (Requires External Services)
- [ ] File uploads (AWS S3)
- [ ] SMS sending (Twilio)
- [ ] Email sending (SendGrid)
- [ ] Push notifications (Firebase)
- [ ] Auth0 integration

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```
   Error: Can't reach database server
   ```
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Redis Connection Error**
   ```
   Error: Redis connection failed
   ```
   - Ensure Redis is running
   - Check Redis configuration in `.env`

3. **Port Already in Use**
   ```
   Error: Port 3000 is already in use
   ```
   - Change PORT in `.env` file
   - Or stop the process using port 3000

4. **TypeScript Compilation Errors**
   ```bash
   # Rebuild the project
   npm run build
   ```

### Database Reset

If you need to reset the database:

```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npm run db:generate
```

## Next Steps

1. **Run the automated tests** to verify everything works
2. **Check the test results** for any failures
3. **Use the generated tokens** for manual API testing
4. **Set up external services** (Twilio, SendGrid, etc.) for full functionality
5. **Configure production environment** variables

## API Documentation

- **Base URL**: `http://localhost:3000/api/v1`
- **Health Check**: `http://localhost:3000/health`
- **API Root**: `http://localhost:3000/`

### Authentication

All protected endpoints require a Bearer token:
```
Authorization: Bearer <your-jwt-token>
```

### Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 1000 per IP (configurable)

## Support

If you encounter issues:

1. Check the server logs for detailed error messages
2. Verify all dependencies are installed correctly
3. Ensure database and Redis are running
4. Check the `.env` configuration
5. Review the test output for specific failures

Happy testing! 🚀
