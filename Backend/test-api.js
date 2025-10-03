/**
 * API Integration Test for FixRx
 * Tests the frontend-backend integration
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';

async function testAPI() {
  console.log('🧪 Testing FixRx API Integration...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('');

    // Test 2: User Registration
    console.log('2️⃣ Testing User Registration...');
    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      userType: 'CONSUMER'
    };
    
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
    console.log('✅ Registration:', registerResponse.data.message);
    console.log('📝 User ID:', registerResponse.data.data.user.id);
    console.log('🔑 Token received:', registerResponse.data.data.token ? 'Yes' : 'No');
    console.log('');

    // Test 3: Consumer Dashboard
    console.log('3️⃣ Testing Consumer Dashboard...');
    const dashboardResponse = await axios.get(`${API_BASE}/consumers/dashboard`);
    console.log('✅ Dashboard loaded successfully');
    console.log('👥 Recommended vendors:', dashboardResponse.data.data.recommendedVendors.length);
    console.log('📊 User stats:', dashboardResponse.data.data.stats);
    console.log('');

    // Test 4: User Profile
    console.log('4️⃣ Testing User Profile...');
    const profileResponse = await axios.get(`${API_BASE}/users/profile`);
    console.log('✅ Profile loaded:', profileResponse.data.data.firstName, profileResponse.data.data.lastName);
    console.log('');

    console.log('🎉 All API tests passed! Frontend-Backend integration is working correctly.');
    console.log('');
    console.log('📱 You can now test the frontend app:');
    console.log('   1. Open your frontend app (Expo Go or browser)');
    console.log('   2. Navigate through: Welcome → Email → User Type → Profile');
    console.log('   3. Complete registration - it will use these APIs!');
    console.log('   4. View dashboard with real data from backend');

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('📄 Response:', error.response.data);
    }
  }
}

// Run the test
testAPI();
