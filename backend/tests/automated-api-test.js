/**
 * FixRx API Automated Testing Suite
 * 
 * This script tests all major API endpoints to ensure they're working correctly.
 * Run this after starting the server to verify all functionality.
 */

const axios = require('axios');
const colors = require('colors');

// Configuration
const BASE_URL = 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api/v1`;

// Test data
const testData = {
  consumer: {
    email: 'testconsumer@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Consumer',
    phone: '+1234567890',
    role: 'CONSUMER'
  },
  vendor: {
    email: 'testvendor@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Vendor',
    phone: '+1234567891',
    role: 'VENDOR',
    businessName: 'Test Vendor Business',
    businessDescription: 'A test vendor for API testing',
    serviceCategories: ['plumbing', 'electrical']
  }
};

// Store tokens and IDs for subsequent tests
let tokens = {
  consumer: null,
  vendor: null
};

let userIds = {
  consumer: null,
  vendor: null
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

/**
 * Utility function to make HTTP requests
 */
async function makeRequest(method, url, data = null, headers = {}) {
  try {
    const config = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

/**
 * Test runner function
 */
async function runTest(testName, testFunction) {
  testResults.total++;
  console.log(`\n🧪 Testing: ${testName}`.yellow);
  
  try {
    const result = await testFunction();
    if (result.success) {
      console.log(`✅ PASS: ${testName}`.green);
      testResults.passed++;
      return result;
    } else {
      console.log(`❌ FAIL: ${testName}`.red);
      console.log(`   Error: ${JSON.stringify(result.error)}`.red);
      testResults.failed++;
      return result;
    }
  } catch (error) {
    console.log(`❌ FAIL: ${testName}`.red);
    console.log(`   Error: ${error.message}`.red);
    testResults.failed++;
    return { success: false, error: error.message };
  }
}

/**
 * Wait for server to be ready
 */
async function waitForServer(maxAttempts = 30) {
  console.log('🔄 Waiting for server to be ready...'.cyan);
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await axios.get(`${BASE_URL}/health`);
      if (response.status === 200) {
        console.log('✅ Server is ready!'.green);
        return true;
      }
    } catch (error) {
      console.log(`⏳ Attempt ${i + 1}/${maxAttempts} - Server not ready yet...`.yellow);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  throw new Error('Server failed to start within expected time');
}

/**
 * Test Functions
 */

// 1. Health Check Tests
async function testHealthCheck() {
  const result = await makeRequest('GET', `${BASE_URL}/health`);
  return {
    success: result.success && result.status === 200,
    data: result.data,
    error: result.error
  };
}

async function testApiRoot() {
  const result = await makeRequest('GET', BASE_URL);
  return {
    success: result.success && result.status === 200,
    data: result.data,
    error: result.error
  };
}

// 2. Authentication Tests
async function testConsumerRegistration() {
  const result = await makeRequest('POST', `${API_BASE}/auth/register`, testData.consumer);
  if (result.success) {
    userIds.consumer = result.data.user?.id;
  }
  return result;
}

async function testVendorRegistration() {
  const result = await makeRequest('POST', `${API_BASE}/auth/register`, testData.vendor);
  if (result.success) {
    userIds.vendor = result.data.user?.id;
  }
  return result;
}

async function testConsumerLogin() {
  const loginData = {
    email: testData.consumer.email,
    password: testData.consumer.password
  };
  const result = await makeRequest('POST', `${API_BASE}/auth/login`, loginData);
  if (result.success) {
    tokens.consumer = result.data.token || result.data.accessToken;
  }
  return result;
}

async function testVendorLogin() {
  const loginData = {
    email: testData.vendor.email,
    password: testData.vendor.password
  };
  const result = await makeRequest('POST', `${API_BASE}/auth/login`, loginData);
  if (result.success) {
    tokens.vendor = result.data.token || result.data.accessToken;
  }
  return result;
}

// 3. User Profile Tests
async function testGetConsumerProfile() {
  if (!tokens.consumer) {
    return { success: false, error: 'No consumer token available' };
  }
  
  const result = await makeRequest('GET', `${API_BASE}/users/profile`, null, {
    'Authorization': `Bearer ${tokens.consumer}`
  });
  return result;
}

async function testGetVendorProfile() {
  if (!tokens.vendor) {
    return { success: false, error: 'No vendor token available' };
  }
  
  const result = await makeRequest('GET', `${API_BASE}/users/profile`, null, {
    'Authorization': `Bearer ${tokens.vendor}`
  });
  return result;
}

// 4. Vendor Search Tests (Public endpoints)
async function testVendorSearch() {
  const result = await makeRequest('GET', `${API_BASE}/vendors/search?query=plumber&lat=40.7128&lng=-74.0060&radius=50&page=1&limit=10`);
  return result;
}

async function testVendorCategories() {
  const result = await makeRequest('GET', `${API_BASE}/vendors/categories/list`);
  return result;
}

async function testFeaturedVendors() {
  const result = await makeRequest('GET', `${API_BASE}/vendors/featured/list?limit=10`);
  return result;
}

async function testNearbyVendors() {
  const result = await makeRequest('GET', `${API_BASE}/vendors/nearby/40.7128/-74.0060?radius=25&categories=plumbing,electrical`);
  return result;
}

// 5. Protected Vendor Tests
async function testVendorProfileMe() {
  if (!tokens.vendor) {
    return { success: false, error: 'No vendor token available' };
  }
  
  const result = await makeRequest('GET', `${API_BASE}/vendors/profile/me`, null, {
    'Authorization': `Bearer ${tokens.vendor}`
  });
  return result;
}

async function testUpdateVendorProfile() {
  if (!tokens.vendor) {
    return { success: false, error: 'No vendor token available' };
  }
  
  const updateData = {
    businessDescription: 'Updated test description',
    hourlyRate: 75.00,
    serviceCategories: ['plumbing', 'electrical', 'hvac']
  };
  
  const result = await makeRequest('PUT', `${API_BASE}/vendors/profile/me`, updateData, {
    'Authorization': `Bearer ${tokens.vendor}`
  });
  return result;
}

// 6. Consumer Tests
async function testConsumerProfileMe() {
  if (!tokens.consumer) {
    return { success: false, error: 'No consumer token available' };
  }
  
  const result = await makeRequest('GET', `${API_BASE}/consumers/profile/me`, null, {
    'Authorization': `Bearer ${tokens.consumer}`
  });
  return result;
}

async function testUpdateConsumerProfile() {
  if (!tokens.consumer) {
    return { success: false, error: 'No consumer token available' };
  }
  
  const updateData = {
    preferences: {
      preferredCategories: ['plumbing', 'electrical'],
      maxDistance: 30
    },
    searchRadius: 25
  };
  
  const result = await makeRequest('PUT', `${API_BASE}/consumers/profile/me`, updateData, {
    'Authorization': `Bearer ${tokens.consumer}`
  });
  return result;
}

// 7. Rating Tests
async function testCreateRating() {
  if (!tokens.consumer || !userIds.vendor) {
    return { success: false, error: 'Missing consumer token or vendor ID' };
  }
  
  const ratingData = {
    vendorId: userIds.vendor,
    costEffectiveness: 4,
    qualityOfService: 5,
    timelinessOfDelivery: 4,
    professionalism: 5,
    reviewTitle: 'Test Review',
    reviewText: 'This is a test review for API testing',
    jobDescription: 'Test job',
    jobValue: 100.00
  };
  
  const result = await makeRequest('POST', `${API_BASE}/ratings/create`, ratingData, {
    'Authorization': `Bearer ${tokens.consumer}`
  });
  return result;
}

// 8. Invitation Tests
async function testSendSMSInvitation() {
  if (!tokens.consumer) {
    return { success: false, error: 'No consumer token available' };
  }
  
  const invitationData = {
    recipientPhone: '+1234567899',
    message: 'Test SMS invitation from API test'
  };
  
  const result = await makeRequest('POST', `${API_BASE}/invitations/send-sms`, invitationData, {
    'Authorization': `Bearer ${tokens.consumer}`
  });
  return result;
}

async function testSendEmailInvitation() {
  if (!tokens.consumer) {
    return { success: false, error: 'No consumer token available' };
  }
  
  const invitationData = {
    recipientEmail: 'test@example.com',
    message: 'Test email invitation from API test'
  };
  
  const result = await makeRequest('POST', `${API_BASE}/invitations/send-email`, invitationData, {
    'Authorization': `Bearer ${tokens.consumer}`
  });
  return result;
}

// 9. Contact Tests
async function testImportContacts() {
  if (!tokens.consumer) {
    return { success: false, error: 'No consumer token available' };
  }
  
  const contactData = {
    contacts: [
      {
        firstName: 'Test',
        lastName: 'Contact',
        phone: '+1234567898',
        email: 'testcontact@example.com'
      }
    ]
  };
  
  const result = await makeRequest('POST', `${API_BASE}/contacts/import`, contactData, {
    'Authorization': `Bearer ${tokens.consumer}`
  });
  return result;
}

/**
 * Main test execution
 */
async function runAllTests() {
  console.log('🚀 Starting FixRx API Test Suite'.cyan.bold);
  console.log('====================================='.cyan);
  
  try {
    // Wait for server
    await waitForServer();
    
    // 1. Health Check Tests
    console.log('\n📋 HEALTH CHECK TESTS'.blue.bold);
    await runTest('Health Check Endpoint', testHealthCheck);
    await runTest('API Root Endpoint', testApiRoot);
    
    // 2. Authentication Tests
    console.log('\n🔐 AUTHENTICATION TESTS'.blue.bold);
    await runTest('Consumer Registration', testConsumerRegistration);
    await runTest('Vendor Registration', testVendorRegistration);
    await runTest('Consumer Login', testConsumerLogin);
    await runTest('Vendor Login', testVendorLogin);
    
    // 3. User Profile Tests
    console.log('\n👤 USER PROFILE TESTS'.blue.bold);
    await runTest('Get Consumer Profile', testGetConsumerProfile);
    await runTest('Get Vendor Profile', testGetVendorProfile);
    
    // 4. Public Vendor Tests
    console.log('\n🔍 PUBLIC VENDOR SEARCH TESTS'.blue.bold);
    await runTest('Vendor Search', testVendorSearch);
    await runTest('Vendor Categories', testVendorCategories);
    await runTest('Featured Vendors', testFeaturedVendors);
    await runTest('Nearby Vendors', testNearbyVendors);
    
    // 5. Protected Vendor Tests
    console.log('\n🏢 VENDOR MANAGEMENT TESTS'.blue.bold);
    await runTest('Get Vendor Profile (Me)', testVendorProfileMe);
    await runTest('Update Vendor Profile', testUpdateVendorProfile);
    
    // 6. Consumer Tests
    console.log('\n🛒 CONSUMER MANAGEMENT TESTS'.blue.bold);
    await runTest('Get Consumer Profile (Me)', testConsumerProfileMe);
    await runTest('Update Consumer Profile', testUpdateConsumerProfile);
    
    // 7. Rating Tests
    console.log('\n⭐ RATING SYSTEM TESTS'.blue.bold);
    await runTest('Create Rating', testCreateRating);
    
    // 8. Invitation Tests
    console.log('\n📧 INVITATION SYSTEM TESTS'.blue.bold);
    await runTest('Send SMS Invitation', testSendSMSInvitation);
    await runTest('Send Email Invitation', testSendEmailInvitation);
    
    // 9. Contact Tests
    console.log('\n📱 CONTACT MANAGEMENT TESTS'.blue.bold);
    await runTest('Import Contacts', testImportContacts);
    
    // Test Summary
    console.log('\n📊 TEST SUMMARY'.magenta.bold);
    console.log('====================================='.magenta);
    console.log(`Total Tests: ${testResults.total}`.white);
    console.log(`Passed: ${testResults.passed}`.green);
    console.log(`Failed: ${testResults.failed}`.red);
    console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`.cyan);
    
    if (testResults.failed === 0) {
      console.log('\n🎉 All tests passed! Your API is working correctly.'.green.bold);
    } else {
      console.log(`\n⚠️  ${testResults.failed} test(s) failed. Please check the errors above.`.yellow.bold);
    }
    
    // Token Information
    if (tokens.consumer || tokens.vendor) {
      console.log('\n🔑 AUTHENTICATION TOKENS'.blue.bold);
      console.log('Use these tokens for manual testing:'.white);
      if (tokens.consumer) {
        console.log(`Consumer Token: ${tokens.consumer}`.green);
      }
      if (tokens.vendor) {
        console.log(`Vendor Token: ${tokens.vendor}`.green);
      }
    }
    
  } catch (error) {
    console.log(`\n💥 Test suite failed to run: ${error.message}`.red.bold);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
FixRx API Test Suite

Usage: node automated-api-test.js [options]

Options:
  --help, -h     Show this help message
  
Make sure your server is running on http://localhost:3000 before running tests.
  `.white);
  process.exit(0);
}

// Run the tests
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  makeRequest,
  testResults
};
