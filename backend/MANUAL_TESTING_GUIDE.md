# FixRx API Manual Testing Guide

## Quick Start

1. **Start the test server:**
   ```bash
   node test-server.js
   ```

2. **Server will be available at:** `http://localhost:3000`

## 🧪 Manual Testing Examples

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Register a Consumer
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "CONSUMER"
  }'
```

### 3. Register a Vendor
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendor@example.com",
    "password": "Password123!",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1234567891",
    "role": "VENDOR",
    "businessName": "Smith Plumbing Services",
    "businessDescription": "Professional plumbing services",
    "serviceCategories": ["plumbing", "hvac"]
  }'
```

### 4. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

**Save the token from the response for authenticated requests!**

### 5. Get User Profile (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Search Vendors (Public)
```bash
curl "http://localhost:3000/api/v1/vendors/search?query=plumber&lat=40.7128&lng=-74.0060&radius=50&page=1&limit=10"
```

### 7. Get Vendor Categories (Public)
```bash
curl http://localhost:3000/api/v1/vendors/categories/list
```

### 8. Create a Rating (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/ratings/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "vendorId": "VENDOR_ID_HERE",
    "costEffectiveness": 4,
    "qualityOfService": 5,
    "timelinessOfDelivery": 4,
    "professionalism": 5,
    "reviewTitle": "Excellent Service",
    "reviewText": "Very professional and timely service. Highly recommended!",
    "jobDescription": "Fixed kitchen sink leak",
    "jobValue": 150.00
  }'
```

### 9. Send SMS Invitation (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/invitations/send-sms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "recipientPhone": "+1234567892",
    "message": "Join FixRx to connect with trusted service providers!"
  }'
```

### 10. Import Contacts (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/contacts/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "contacts": [
      {
        "firstName": "Alice",
        "lastName": "Johnson",
        "phone": "+1234567893",
        "email": "alice@example.com"
      },
      {
        "firstName": "Bob",
        "lastName": "Wilson",
        "phone": "+1234567894",
        "email": "bob@example.com"
      }
    ]
  }'
```

## 🔧 Using REST Client Extensions

If you're using VS Code with Thunder Client or REST Client extension, you can use the `tests/api-tests.http` file directly.

### Thunder Client Steps:
1. Install Thunder Client extension
2. Open `tests/api-tests.http`
3. Click "Send Request" on any endpoint
4. Copy tokens from responses for authenticated requests

## 📊 Expected Response Formats

### Successful Registration Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "test_abc123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CONSUMER",
    "status": "ACTIVE"
  },
  "token": "mock_jwt_token_test_abc123_1727089234567"
}
```

### Vendor Search Response:
```json
{
  "vendors": [
    {
      "id": "test_def456",
      "businessName": "Smith Plumbing Services",
      "businessDescription": "Professional plumbing services",
      "serviceCategories": ["plumbing", "hvac"],
      "totalRatings": 0,
      "averageRating": 0,
      "user": {
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "vendor@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Rating Creation Response:
```json
{
  "rating": {
    "id": "test_ghi789",
    "giverId": "test_abc123",
    "vendorId": "test_def456",
    "costEffectiveness": 4,
    "qualityOfService": 5,
    "timelinessOfDelivery": 4,
    "professionalism": 5,
    "overallRating": 4.5,
    "reviewTitle": "Excellent Service",
    "reviewText": "Very professional and timely service.",
    "createdAt": "2025-09-23T07:47:14.567Z"
  }
}
```

## 🚨 Error Responses

### Authentication Error:
```json
{
  "error": "No token provided"
}
```

### Validation Error:
```json
{
  "error": "User already exists"
}
```

### Authorization Error:
```json
{
  "error": "Access denied. Vendor role required."
}
```

## 🎯 Testing Scenarios

### Complete User Journey Test:
1. Register as consumer
2. Register as vendor
3. Login as consumer (save token)
4. Search for vendors
5. Get vendor categories
6. Login as vendor (save token)
7. Update vendor profile
8. Login as consumer again
9. Create rating for vendor
10. Send invitations
11. Import contacts

### Role-Based Access Test:
1. Register as consumer
2. Try to access vendor-only endpoints (should fail)
3. Register as vendor
4. Try to access consumer-only endpoints (should fail)
5. Access appropriate role-based endpoints (should succeed)

## 📱 Integration Testing

The mock server is perfect for:
- Frontend development
- API contract validation
- Integration testing
- Demo purposes
- Development without external dependencies

## 🔄 Next Steps

1. **Frontend Integration:** Use these endpoints to build your React Native app
2. **Database Setup:** When ready, switch to the full server with PostgreSQL
3. **Third-Party Services:** Add real Twilio, SendGrid, Firebase integrations
4. **Production Deployment:** Deploy with proper security and monitoring

---

*Happy testing! 🚀*
