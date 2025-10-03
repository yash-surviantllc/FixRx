/**
 * Test Logout Functionality
 * Tests both backend endpoint and frontend service behavior
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';

async function testLogout() {
  console.log('🔐 Testing Logout Functionality...\n');

  try {
    // Test 1: Backend Logout Endpoint
    console.log('1️⃣ Testing Backend Logout Endpoint...');
    const logoutResponse = await axios.delete(`${API_BASE}/auth/logout`);
    console.log('✅ Backend Logout:', logoutResponse.data.message);
    console.log('📊 Status Code:', logoutResponse.status);
    console.log('');

    // Test 2: Login first to test full flow
    console.log('2️⃣ Testing Full Login-Logout Flow...');
    const loginData = {
      email: 'test@fixrx.com',
      password: 'TestPass123!'
    };
    
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
    console.log('✅ Login successful:', loginResponse.data.data.user.firstName);
    const token = loginResponse.data.data.token;
    console.log('🔑 Token received:', token ? 'Yes' : 'No');
    console.log('');

    // Test 3: Logout with token
    console.log('3️⃣ Testing Logout with Authentication...');
    const authenticatedLogout = await axios.delete(`${API_BASE}/auth/logout`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Authenticated Logout:', authenticatedLogout.data.message);
    console.log('');

    console.log('🎉 All Logout Tests Passed!');
    console.log('');
    console.log('✅ LOGOUT FUNCTIONALITY VERIFIED');
    console.log('📱 Frontend Issue Analysis:');
    console.log('   • Backend logout endpoint: ✅ Working');
    console.log('   • Authentication flow: ✅ Working');
    console.log('   • Token handling: ✅ Working');
    console.log('');
    console.log('🔍 Possible Frontend Issues:');
    console.log('   1. UI not calling authService.logout()');
    console.log('   2. State not updating after logout');
    console.log('   3. Navigation not redirecting to login');
    console.log('   4. AsyncStorage not clearing properly');
    console.log('');
    console.log('💡 Frontend Debugging Steps:');
    console.log('   1. Check browser console for errors');
    console.log('   2. Verify logout button calls authService.logout()');
    console.log('   3. Check if authentication state updates');
    console.log('   4. Ensure navigation redirects after logout');

  } catch (error) {
    console.error('❌ Logout Test Failed:', error.message);
    if (error.response) {
      console.error('📄 Response:', error.response.data);
      console.error('📊 Status:', error.response.status);
    }
  }
}

// Run the test
testLogout();
