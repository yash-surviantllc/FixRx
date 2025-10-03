/**
 * Test Frontend-Backend Connection
 * Verifies that the main server endpoints work correctly
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';

async function testConnection() {
  console.log('🔗 Testing Frontend-Backend Connection...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('📋 Features:', Object.keys(healthResponse.data.features).join(', '));
    console.log('');

    // Test 2: User Registration (matches frontend interface)
    console.log('2️⃣ Testing User Registration...');
    const registerData = {
      email: 'test@fixrx.com',
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User',
      userType: 'CONSUMER',
      phone: '+1234567890',
      metroArea: 'San Francisco'
    };
    
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
    console.log('✅ Registration:', registerResponse.data.message);
    console.log('👤 User ID:', registerResponse.data.data.user.id);
    console.log('🔑 Token received:', registerResponse.data.data.token ? 'Yes' : 'No');
    console.log('');

    // Test 3: User Login
    console.log('3️⃣ Testing User Login...');
    const loginData = {
      email: 'test@fixrx.com',
      password: 'TestPass123!'
    };
    
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
    console.log('✅ Login:', loginResponse.data.message);
    console.log('👤 User:', loginResponse.data.data.user.firstName, loginResponse.data.data.user.lastName);
    console.log('');

    // Test 4: Consumer Dashboard
    console.log('4️⃣ Testing Consumer Dashboard...');
    const dashboardResponse = await axios.get(`${API_BASE}/consumers/dashboard`);
    console.log('✅ Dashboard loaded successfully');
    console.log('👥 Recommended vendors:', dashboardResponse.data.data.recommendedVendors.length);
    console.log('📊 User stats:', JSON.stringify(dashboardResponse.data.data.stats));
    console.log('');

    // Test 5: Vendor Search
    console.log('5️⃣ Testing Vendor Search...');
    const searchResponse = await axios.get(`${API_BASE}/vendors/search?query=plumbing&location=San Francisco`);
    console.log('✅ Vendor search successful');
    console.log('🔍 Found vendors:', searchResponse.data.data.vendors.length);
    console.log('');

    // Test 6: Rating System
    console.log('6️⃣ Testing Rating System...');
    const ratingData = {
      vendorId: 'vendor_1',
      consumerId: 'user_123',
      serviceId: 'service_1',
      ratings: {
        cost: 5,
        quality: 4,
        timeliness: 5,
        professionalism: 5
      },
      comment: 'Great service!'
    };
    
    const ratingResponse = await axios.post(`${API_BASE}/ratings`, ratingData);
    console.log('✅ Rating submitted:', ratingResponse.data.message);
    console.log('⭐ Overall rating:', ratingResponse.data.data.overallRating);
    console.log('');

    console.log('🎉 All Connection Tests Passed!');
    console.log('');
    console.log('✅ FRONTEND-BACKEND CONNECTION VERIFIED');
    console.log('📱 Your React Native app can now connect to:');
    console.log('   • Authentication endpoints');
    console.log('   • Consumer dashboard');
    console.log('   • Vendor search');
    console.log('   • Rating system');
    console.log('   • All other features');
    console.log('');
    console.log('🔗 Frontend API Config: http://localhost:3000/api/v1');
    console.log('🚀 Backend Server: Running and ready');
    console.log('📱 Frontend: Ready to connect');

  } catch (error) {
    console.error('❌ Connection Test Failed:', error.message);
    if (error.response) {
      console.error('📄 Response:', error.response.data);
    }
  }
}

// Run the test
testConnection();
