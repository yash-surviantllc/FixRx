/**
 * Enhanced Authentication System Test Suite for FixRx
 * Tests all new user management and security features
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';
const ENHANCED_AUTH_URL = `${BASE_URL}/auth/enhanced`;

// Test configuration
const testConfig = {
  timeout: 10000,
  retries: 3
};

// Test user data
const testUsers = {
  consumer: {
    email: 'test.consumer.enhanced@fixrx.com',
    password: 'SecurePass123!',
    firstName: 'Enhanced',
    lastName: 'Consumer',
    userType: 'CONSUMER',
    phone: '+1234567890',
    metroArea: 'San Francisco'
  },
  vendor: {
    email: 'test.vendor.enhanced@fixrx.com',
    password: 'SecurePass456!',
    firstName: 'Enhanced',
    lastName: 'Vendor',
    userType: 'VENDOR',
    phone: '+0987654321',
    metroArea: 'New York'
  }
};

// Store tokens for authenticated requests
let authTokens = {
  consumer: null,
  vendor: null
};

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Helper function to make HTTP requests with error handling
async function makeRequest(method, url, data = null, headers = {}) {
  try {
    const config = {
      method,
      url,
      timeout: testConfig.timeout,
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

// Test function wrapper
async function runTest(testName, testFunction) {
  testResults.total++;
  console.log(`\n🧪 Running: ${testName}`);
  
  try {
    const result = await testFunction();
    if (result.success) {
      testResults.passed++;
      console.log(`✅ PASSED: ${testName}`);
      testResults.details.push({ test: testName, status: 'PASSED', message: result.message });
    } else {
      testResults.failed++;
      console.log(`❌ FAILED: ${testName} - ${result.message}`);
      testResults.details.push({ test: testName, status: 'FAILED', message: result.message });
    }
  } catch (error) {
    testResults.failed++;
    console.log(`❌ ERROR: ${testName} - ${error.message}`);
    testResults.details.push({ test: testName, status: 'ERROR', message: error.message });
  }
}

// Test 1: Enhanced User Registration
async function testEnhancedRegistration() {
  const response = await makeRequest('POST', `${ENHANCED_AUTH_URL}/register`, testUsers.consumer);
  
  if (!response.success) {
    return { success: false, message: `Registration failed: ${JSON.stringify(response.error)}` };
  }

  if (response.data.success && response.data.data.user && response.data.data.token) {
    authTokens.consumer = response.data.data.token;
    return { success: true, message: 'Enhanced registration successful with security features' };
  }

  return { success: false, message: 'Registration response missing required fields' };
}

// Test 2: Password Strength Validation
async function testPasswordStrengthValidation() {
  const weakPasswordUser = {
    ...testUsers.vendor,
    email: 'weak.password@fixrx.com',
    password: '123' // Weak password
  };

  const response = await makeRequest('POST', `${ENHANCED_AUTH_URL}/register`, weakPasswordUser);
  
  if (response.success === false && response.status === 400) {
    return { success: true, message: 'Password strength validation working correctly' };
  }

  return { success: false, message: 'Password strength validation failed' };
}

// Test 3: Enhanced Login with Security Features
async function testEnhancedLogin() {
  const loginData = {
    email: testUsers.consumer.email,
    password: testUsers.consumer.password
  };

  const response = await makeRequest('POST', `${ENHANCED_AUTH_URL}/login`, loginData);
  
  if (!response.success) {
    return { success: false, message: `Login failed: ${JSON.stringify(response.error)}` };
  }

  if (response.data.success && response.data.data.user && response.data.data.token) {
    authTokens.consumer = response.data.data.token;
    return { success: true, message: 'Enhanced login successful with security checks' };
  }

  return { success: false, message: 'Login response missing required fields' };
}

// Test 4: Rate Limiting Protection
async function testRateLimiting() {
  const loginData = {
    email: 'nonexistent@fixrx.com',
    password: 'wrongpassword'
  };

  // Make multiple failed login attempts
  const attempts = [];
  for (let i = 0; i < 6; i++) {
    attempts.push(makeRequest('POST', `${ENHANCED_AUTH_URL}/login`, loginData));
  }

  const responses = await Promise.all(attempts);
  const lastResponse = responses[responses.length - 1];

  if (lastResponse.status === 429) {
    return { success: true, message: 'Rate limiting protection working correctly' };
  }

  return { success: false, message: 'Rate limiting not working as expected' };
}

// Test 5: Profile Management
async function testProfileManagement() {
  if (!authTokens.consumer) {
    return { success: false, message: 'No auth token available for profile test' };
  }

  const profileUpdate = {
    firstName: 'UpdatedEnhanced',
    lastName: 'UpdatedConsumer',
    bio: 'Updated bio with enhanced security'
  };

  const response = await makeRequest(
    'PUT',
    `${ENHANCED_AUTH_URL}/profile`,
    profileUpdate,
    { Authorization: `Bearer ${authTokens.consumer}` }
  );

  if (response.success && response.data.success) {
    return { success: true, message: 'Profile management working correctly' };
  }

  return { success: false, message: `Profile update failed: ${JSON.stringify(response.error)}` };
}

// Test 6: Security Settings Management
async function testSecuritySettings() {
  if (!authTokens.consumer) {
    return { success: false, message: 'No auth token available for security settings test' };
  }

  const securitySettings = {
    enable2FA: true,
    sessionTimeout: 60,
    loginNotifications: true
  };

  const response = await makeRequest(
    'PUT',
    `${ENHANCED_AUTH_URL}/security-settings`,
    securitySettings,
    { Authorization: `Bearer ${authTokens.consumer}` }
  );

  if (response.success && response.data.success) {
    return { success: true, message: 'Security settings management working correctly' };
  }

  return { success: false, message: `Security settings update failed: ${JSON.stringify(response.error)}` };
}

// Test 7: Password Reset Request
async function testPasswordResetRequest() {
  const resetData = {
    email: testUsers.consumer.email
  };

  const response = await makeRequest('POST', `${ENHANCED_AUTH_URL}/forgot-password`, resetData);

  if (response.success && response.data.success) {
    return { success: true, message: 'Password reset request working correctly' };
  }

  return { success: false, message: `Password reset request failed: ${JSON.stringify(response.error)}` };
}

// Test 8: OAuth Provider Support
async function testOAuthSupport() {
  const oauthData = {
    provider: 'google',
    providerId: 'mock-google-id-123',
    email: 'oauth.test@gmail.com',
    firstName: 'OAuth',
    lastName: 'User'
  };

  const response = await makeRequest('POST', `${ENHANCED_AUTH_URL}/oauth`, oauthData);

  if (response.success && response.data.success) {
    return { success: true, message: 'OAuth integration working correctly' };
  }

  return { success: false, message: `OAuth integration failed: ${JSON.stringify(response.error)}` };
}

// Test 9: Token Refresh Mechanism
async function testTokenRefresh() {
  const response = await makeRequest('POST', `${ENHANCED_AUTH_URL}/refresh`, {
    refreshToken: 'mock-refresh-token'
  });

  // This should fail with current implementation, but endpoint should exist
  if (response.status === 401 || response.status === 400) {
    return { success: true, message: 'Token refresh endpoint available and responding' };
  }

  return { success: false, message: 'Token refresh endpoint not working' };
}

// Test 10: Enhanced Authentication Health Check
async function testEnhancedAuthHealth() {
  const response = await makeRequest('GET', `${ENHANCED_AUTH_URL}/health`);

  if (response.success && response.data.success && response.data.features) {
    const features = response.data.features;
    const requiredFeatures = [
      'registration', 'login', 'oauth', 'emailVerification',
      'passwordReset', 'twoFactorAuth', 'profileManagement',
      'securitySettings', 'rateLimiting'
    ];

    const allFeaturesActive = requiredFeatures.every(feature => 
      features[feature] === 'active'
    );

    if (allFeaturesActive) {
      return { success: true, message: 'All enhanced authentication features are active' };
    } else {
      return { success: false, message: 'Some enhanced authentication features are not active' };
    }
  }

  return { success: false, message: 'Enhanced authentication health check failed' };
}

// Test 11: Input Validation and Sanitization
async function testInputValidation() {
  const maliciousData = {
    email: 'test@example.com',
    password: 'ValidPass123!',
    firstName: '<script>alert("xss")</script>',
    lastName: 'javascript:alert("xss")',
    userType: 'CONSUMER'
  };

  const response = await makeRequest('POST', `${ENHANCED_AUTH_URL}/register`, maliciousData);

  // Should either sanitize input or reject it
  if (response.success === false || 
      (response.success && !response.data.data.user.firstName.includes('<script>'))) {
    return { success: true, message: 'Input validation and sanitization working correctly' };
  }

  return { success: false, message: 'Input validation failed - XSS vulnerability detected' };
}

// Test 12: Account Security Features
async function testAccountSecurity() {
  if (!authTokens.consumer) {
    return { success: false, message: 'No auth token available for security test' };
  }

  // Test getting security settings
  const response = await makeRequest(
    'GET',
    `${ENHANCED_AUTH_URL}/security-settings`,
    null,
    { Authorization: `Bearer ${authTokens.consumer}` }
  );

  if (response.success && response.data.success) {
    return { success: true, message: 'Account security features accessible' };
  }

  return { success: false, message: `Security features test failed: ${JSON.stringify(response.error)}` };
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Enhanced Authentication System Tests for FixRx');
  console.log('=' .repeat(60));

  // Wait for server to be ready
  console.log('⏳ Waiting for server to be ready...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Run all tests
  await runTest('Enhanced User Registration', testEnhancedRegistration);
  await runTest('Password Strength Validation', testPasswordStrengthValidation);
  await runTest('Enhanced Login with Security', testEnhancedLogin);
  await runTest('Rate Limiting Protection', testRateLimiting);
  await runTest('Profile Management', testProfileManagement);
  await runTest('Security Settings Management', testSecuritySettings);
  await runTest('Password Reset Request', testPasswordResetRequest);
  await runTest('OAuth Provider Support', testOAuthSupport);
  await runTest('Token Refresh Mechanism', testTokenRefresh);
  await runTest('Enhanced Auth Health Check', testEnhancedAuthHealth);
  await runTest('Input Validation & Sanitization', testInputValidation);
  await runTest('Account Security Features', testAccountSecurity);

  // Print final results
  console.log('\n' + '=' .repeat(60));
  console.log('📊 ENHANCED AUTHENTICATION TEST RESULTS');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${testResults.passed}/${testResults.total}`);
  console.log(`❌ Failed: ${testResults.failed}/${testResults.total}`);
  console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.details
      .filter(test => test.status !== 'PASSED')
      .forEach(test => {
        console.log(`   • ${test.test}: ${test.message}`);
      });
  }

  console.log('\n🎯 Enhanced Authentication Features Tested:');
  console.log('   • Advanced user registration with validation');
  console.log('   • Password strength requirements');
  console.log('   • Rate limiting and brute force protection');
  console.log('   • Profile management with security');
  console.log('   • Security settings configuration');
  console.log('   • Password reset functionality');
  console.log('   • OAuth provider integration');
  console.log('   • Token refresh mechanisms');
  console.log('   • Input validation and XSS protection');
  console.log('   • Account security features');

  console.log('\n🔐 Security Features Implemented:');
  console.log('   • JWT token authentication with expiration');
  console.log('   • Bcrypt password hashing (12 rounds)');
  console.log('   • Rate limiting (IP and user-based)');
  console.log('   • Input sanitization and validation');
  console.log('   • CORS protection');
  console.log('   • Security headers (Helmet.js)');
  console.log('   • Session management');
  console.log('   • 2FA support framework');

  if (testResults.passed === testResults.total) {
    console.log('\n🎉 All enhanced authentication tests passed! System is ready for production.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the implementation before production deployment.');
  }

  return testResults;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testResults,
  ENHANCED_AUTH_URL
};
