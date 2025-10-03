/**
 * Comprehensive Frontend-Backend Integration Test
 * Tests all endpoints and functionality
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';

async function testFullIntegration() {
  console.log('🔗 Testing Complete Frontend-Backend Integration...\n');

  const results = {
    health: false,
    authentication: false,
    consumerDashboard: false,
    vendorSearch: false,
    ratings: false,
    invitations: false,
    contacts: false,
    userProfile: false
  };

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    results.health = healthResponse.data.success;
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('📋 Features:', Object.keys(healthResponse.data.features).join(', '));
    console.log('');

    // Test 2: Authentication Flow
    console.log('2️⃣ Testing Authentication Flow...');
    
    // Register
    const registerData = {
      email: 'integration@fixrx.com',
      password: 'TestPass123!',
      firstName: 'Integration',
      lastName: 'Test',
      userType: 'CONSUMER',
      phone: '+1234567890',
      metroArea: 'San Francisco'
    };
    
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
    console.log('✅ Registration:', registerResponse.data.message);
    
    // Login
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    console.log('✅ Login:', loginResponse.data.message);
    const token = loginResponse.data.data.token;
    
    // Logout
    const logoutResponse = await axios.delete(`${API_BASE}/auth/logout`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Logout:', logoutResponse.data.message);
    
    results.authentication = true;
    console.log('');

    // Test 3: User Profile
    console.log('3️⃣ Testing User Profile...');
    const profileResponse = await axios.get(`${API_BASE}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    results.userProfile = profileResponse.data.success;
    console.log('✅ Profile:', profileResponse.data.data.firstName, profileResponse.data.data.lastName);
    console.log('');

    // Test 4: Consumer Dashboard
    console.log('4️⃣ Testing Consumer Dashboard...');
    const dashboardResponse = await axios.get(`${API_BASE}/consumers/dashboard`);
    results.consumerDashboard = dashboardResponse.data.success;
    console.log('✅ Dashboard loaded successfully');
    console.log('👥 Recommended vendors:', dashboardResponse.data.data.recommendedVendors.length);
    console.log('📊 User stats:', JSON.stringify(dashboardResponse.data.data.stats));
    console.log('');

    // Test 5: Consumer Recommendations
    console.log('5️⃣ Testing Consumer Recommendations...');
    const recommendationsResponse = await axios.get(`${API_BASE}/consumers/recommendations`);
    console.log('✅ Recommendations loaded:', recommendationsResponse.data.data.vendors.length, 'vendors');
    console.log('');

    // Test 6: Vendor Search
    console.log('6️⃣ Testing Vendor Search...');
    const searchResponse = await axios.get(`${API_BASE}/vendors/search?query=plumbing&location=San Francisco`);
    results.vendorSearch = searchResponse.data.success;
    console.log('✅ Vendor search successful');
    console.log('🔍 Found vendors:', searchResponse.data.data.vendors.length);
    searchResponse.data.data.vendors.forEach(vendor => {
      console.log(`   • ${vendor.businessName} - Rating: ${vendor.rating} (${vendor.reviewCount} reviews)`);
    });
    console.log('');

    // Test 7: Rating System
    console.log('7️⃣ Testing Rating System...');
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
      comment: 'Excellent service, very professional!'
    };
    
    const ratingResponse = await axios.post(`${API_BASE}/ratings`, ratingData);
    results.ratings = ratingResponse.data.success;
    console.log('✅ Rating submitted:', ratingResponse.data.message);
    console.log('⭐ Overall rating:', ratingResponse.data.data.overallRating);
    
    // Get ratings
    const getRatingsResponse = await axios.get(`${API_BASE}/ratings?vendorId=vendor_1`);
    console.log('✅ Ratings retrieved:', getRatingsResponse.data.data.ratings.length, 'ratings');
    console.log('📊 Average rating:', getRatingsResponse.data.data.averageRating);
    console.log('');

    // Test 8: Invitation System
    console.log('8️⃣ Testing Invitation System...');
    
    // Single invitation
    const invitationData = {
      recipientEmail: 'friend@example.com',
      recipientPhone: '+1987654321',
      message: 'Join FixRx to find great contractors!',
      invitationType: 'email'
    };
    
    const invitationResponse = await axios.post(`${API_BASE}/invitations/send`, invitationData);
    console.log('✅ Single invitation sent:', invitationResponse.data.message);
    
    // Bulk invitations
    const bulkData = {
      recipients: [
        { email: 'user1@example.com', phone: '+1111111111' },
        { email: 'user2@example.com', phone: '+2222222222' }
      ],
      message: 'Join our platform!',
      invitationType: 'email'
    };
    
    const bulkResponse = await axios.post(`${API_BASE}/invitations/bulk`, bulkData);
    results.invitations = bulkResponse.data.success;
    console.log('✅ Bulk invitations sent:', bulkResponse.data.message);
    console.log('📊 Total sent:', bulkResponse.data.data.totalSent);
    console.log('');

    // Test 9: Contact Management
    console.log('9️⃣ Testing Contact Management...');
    
    // Import contacts
    const contactsData = {
      contacts: [
        { name: 'John Smith', email: 'john@example.com', phone: '+1555555555' },
        { name: 'Jane Doe', email: 'jane@example.com', phone: '+1666666666' }
      ],
      source: 'manual'
    };
    
    const importResponse = await axios.post(`${API_BASE}/contacts/import`, contactsData);
    console.log('✅ Contacts imported:', importResponse.data.message);
    console.log('📊 Imported:', importResponse.data.data.imported, 'contacts');
    
    // Search contacts
    const searchContactsResponse = await axios.get(`${API_BASE}/contacts/search?query=john`);
    results.contacts = searchContactsResponse.data.success;
    console.log('✅ Contact search:', searchContactsResponse.data.data.contacts.length, 'results');
    console.log('');

    // Summary
    console.log('🎉 Integration Test Complete!');
    console.log('=' .repeat(50));
    
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`📊 Results: ${passedTests}/${totalTests} tests passed`);
    console.log('');
    
    Object.entries(results).forEach(([test, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
    });
    
    console.log('');
    console.log('🔗 FRONTEND-BACKEND INTEGRATION STATUS:');
    
    if (passedTests === totalTests) {
      console.log('🎯 FULLY INTEGRATED - All systems operational!');
      console.log('📱 Your React Native app can now:');
      console.log('   • Authenticate users with real backend');
      console.log('   • Load consumer dashboards with live data');
      console.log('   • Search vendors with real results');
      console.log('   • Submit and view ratings');
      console.log('   • Send invitations (single & bulk)');
      console.log('   • Manage contacts');
      console.log('   • All while preserving your existing UI!');
    } else {
      console.log('⚠️ PARTIAL INTEGRATION - Some issues detected');
      console.log('🔧 Check failed tests above for troubleshooting');
    }

  } catch (error) {
    console.error('❌ Integration Test Failed:', error.message);
    if (error.response) {
      console.error('📄 Response:', error.response.data);
      console.error('📊 Status:', error.response.status);
    }
  }
}

// Run the comprehensive test
testFullIntegration();
