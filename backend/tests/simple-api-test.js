/**
 * Simple FixRx API Test Script (No external dependencies)
 * 
 * This script tests basic API endpoints using only Node.js built-in modules.
 * Run this to quickly verify your API is working.
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

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

// Store tokens for subsequent tests
let tokens = {
  consumer: null,
  vendor: null
};

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

/**
 * Make HTTP request using Node.js built-in modules
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const httpModule = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = httpModule.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            data: jsonData
          });
        } catch (error) {
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject({
        success: false,
        error: error.message
      });
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

/**
 * Test runner
 */
async function runTest(testName, testFunction) {
  testResults.total++;
  console.log(`\n🧪 Testing: ${testName}`);
  
  try {
    const result = await testFunction();
    if (result.success) {
      console.log(`✅ PASS: ${testName}`);
      testResults.passed++;
      return result;
    } else {
      console.log(`❌ FAIL: ${testName}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Error: ${JSON.stringify(result.data || result.error)}`);
      testResults.failed++;
      return result;
    }
  } catch (error) {
    console.log(`❌ FAIL: ${testName}`);
    console.log(`   Error: ${error.message}`);
    testResults.failed++;
    return { success: false, error: error.message };
  }
}

/**
 * Wait for server to be ready
 */
async function waitForServer(maxAttempts = 15) {
  console.log('🔄 Waiting for server to be ready...');
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const result = await makeRequest(`${BASE_URL}/health`);
      if (result.success) {
        console.log('✅ Server is ready!');
        return true;
      }
    } catch (error) {
      console.log(`⏳ Attempt ${i + 1}/${maxAttempts} - Server not ready yet...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  throw new Error('Server failed to start within expected time');
}

/**
 * Test Functions
 */

async function testHealthCheck() {
  return await makeRequest(`${BASE_URL}/health`);
}

async function testApiRoot() {
  return await makeRequest(BASE_URL);
}

async function testConsumerRegistration() {
  const result = await makeRequest(`${API_BASE}/auth/register`, {
    method: 'POST',
    body: testData.consumer
  });
  return result;
}

async function testVendorRegistration() {
  const result = await makeRequest(`${API_BASE}/auth/register`, {
    method: 'POST',
    body: testData.vendor
  });
  return result;
}

async function testConsumerLogin() {
  const loginData = {
    email: testData.consumer.email,
    password: testData.consumer.password
  };
  const result = await makeRequest(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: loginData
  });
  if (result.success && result.data) {
    tokens.consumer = result.data.token || result.data.accessToken;
  }
  return result;
}

async function testVendorLogin() {
  const loginData = {
    email: testData.vendor.email,
    password: testData.vendor.password
  };
  const result = await makeRequest(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: loginData
  });
  if (result.success && result.data) {
    tokens.vendor = result.data.token || result.data.accessToken;
  }
  return result;
}

async function testGetConsumerProfile() {
  if (!tokens.consumer) {
    return { success: false, error: 'No consumer token available' };
  }
  
  return await makeRequest(`${API_BASE}/users/profile`, {
    headers: {
      'Authorization': `Bearer ${tokens.consumer}`
    }
  });
}

async function testVendorSearch() {
  return await makeRequest(`${API_BASE}/vendors/search?query=plumber&lat=40.7128&lng=-74.0060&radius=50&page=1&limit=10`);
}

async function testVendorCategories() {
  return await makeRequest(`${API_BASE}/vendors/categories/list`);
}

/**
 * Main test execution
 */
async function runAllTests() {
  console.log('🚀 Starting FixRx API Simple Test Suite');
  console.log('=====================================');
  
  try {
    // Wait for server
    await waitForServer();
    
    // Basic Tests
    console.log('\n📋 BASIC TESTS');
    await runTest('Health Check', testHealthCheck);
    await runTest('API Root', testApiRoot);
    
    // Authentication Tests
    console.log('\n🔐 AUTHENTICATION TESTS');
    await runTest('Consumer Registration', testConsumerRegistration);
    await runTest('Vendor Registration', testVendorRegistration);
    await runTest('Consumer Login', testConsumerLogin);
    await runTest('Vendor Login', testVendorLogin);
    
    // Profile Tests
    console.log('\n👤 PROFILE TESTS');
    await runTest('Get Consumer Profile', testGetConsumerProfile);
    
    // Public API Tests
    console.log('\n🔍 PUBLIC API TESTS');
    await runTest('Vendor Search', testVendorSearch);
    await runTest('Vendor Categories', testVendorCategories);
    
    // Test Summary
    console.log('\n📊 TEST SUMMARY');
    console.log('=====================================');
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    if (testResults.failed === 0) {
      console.log('\n🎉 All tests passed! Your API is working correctly.');
    } else {
      console.log(`\n⚠️  ${testResults.failed} test(s) failed. Please check the errors above.`);
    }
    
    // Token Information
    if (tokens.consumer || tokens.vendor) {
      console.log('\n🔑 AUTHENTICATION TOKENS');
      console.log('Use these tokens for manual testing:');
      if (tokens.consumer) {
        console.log(`Consumer Token: ${tokens.consumer}`);
      }
      if (tokens.vendor) {
        console.log(`Vendor Token: ${tokens.vendor}`);
      }
    }
    
  } catch (error) {
    console.log(`\n💥 Test suite failed to run: ${error.message}`);
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { runAllTests, makeRequest, testResults };
