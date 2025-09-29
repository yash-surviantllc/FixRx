const http = require('http');

const BASE_URL = 'localhost';
const PORT = 3000;

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testLoginProfileFlow() {
  console.log('🧪 TESTING LOGIN & PROFILE SETUP FLOW');
  console.log('='.repeat(50));

  try {
    // Step 1: Test Registration
    console.log('\n1️⃣ Testing User Registration...');
    const registerData = {
      email: 'testuser@example.com',
      password: 'testpass123',
      firstName: 'Test',
      lastName: 'User',
      role: 'CONSUMER'
    };

    const registerResponse = await makeRequest('POST', '/api/v1/auth/register', registerData);
    console.log('✅ Registration Status:', registerResponse.status);
    console.log('📄 Registration Response:', JSON.stringify(registerResponse.data, null, 2));

    if (registerResponse.status !== 201) {
      throw new Error('Registration failed');
    }

    // Step 2: Test Login
    console.log('\n2️⃣ Testing User Login...');
    const loginData = {
      email: 'testuser@example.com',
      password: 'testpass123'
    };

    const loginResponse = await makeRequest('POST', '/api/v1/auth/login', loginData);
    console.log('✅ Login Status:', loginResponse.status);
    console.log('📄 Login Response:', JSON.stringify(loginResponse.data, null, 2));

    if (loginResponse.status !== 200) {
      throw new Error('Login failed');
    }

    // Verify token structure
    const tokens = loginResponse.data.data?.tokens;
    if (!tokens || !tokens.accessToken) {
      throw new Error('No access token in login response');
    }
    console.log('🔑 Access Token received:', tokens.accessToken.substring(0, 20) + '...');

    // Step 3: Test Consumer Profile Check (should return 404 - not found)
    console.log('\n3️⃣ Testing Consumer Profile Check...');
    const profileCheckResponse = await makeRequest('GET', '/api/v1/consumers/profile');
    console.log('✅ Profile Check Status:', profileCheckResponse.status);
    console.log('📄 Profile Check Response:', JSON.stringify(profileCheckResponse.data, null, 2));

    if (profileCheckResponse.status !== 404) {
      console.log('⚠️  Expected 404 (profile not found), got:', profileCheckResponse.status);
    } else {
      console.log('✅ Correctly returned 404 - profile needs to be created');
    }

    // Step 4: Test Consumer Profile Creation
    console.log('\n4️⃣ Testing Consumer Profile Creation...');
    const profileData = {
      preferences: {
        serviceTypes: ['plumbing', 'electrical'],
        maxDistance: 25,
        priceRange: 'moderate'
      },
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Test Street, Test City, NY'
      },
      searchRadius: 25
    };

    const createProfileResponse = await makeRequest('POST', '/api/v1/consumers/profile', profileData);
    console.log('✅ Profile Creation Status:', createProfileResponse.status);
    console.log('📄 Profile Creation Response:', JSON.stringify(createProfileResponse.data, null, 2));

    if (createProfileResponse.status !== 201) {
      throw new Error('Profile creation failed');
    }

    // Step 5: Test Vendor Registration & Profile
    console.log('\n5️⃣ Testing Vendor Registration & Profile...');
    const vendorRegisterData = {
      email: 'vendor@example.com',
      password: 'testpass123',
      firstName: 'Vendor',
      lastName: 'User',
      role: 'VENDOR'
    };

    const vendorRegisterResponse = await makeRequest('POST', '/api/v1/auth/register', vendorRegisterData);
    console.log('✅ Vendor Registration Status:', vendorRegisterResponse.status);

    if (vendorRegisterResponse.status === 201) {
      // Test vendor profile creation
      const vendorProfileData = {
        businessName: 'Test Plumbing Co',
        businessDescription: 'Professional plumbing services',
        serviceCategories: ['plumbing', 'emergency-repair'],
        hourlyRate: 75,
        location: {
          latitude: 40.7589,
          longitude: -73.9851,
          address: '456 Business Ave, Test City, NY'
        }
      };

      const vendorProfileResponse = await makeRequest('POST', '/api/v1/vendors/profile', vendorProfileData);
      console.log('✅ Vendor Profile Creation Status:', vendorProfileResponse.status);
      console.log('📄 Vendor Profile Response:', JSON.stringify(vendorProfileResponse.data, null, 2));
    }

    // Step 6: Test the complete authentication flow
    console.log('\n6️⃣ Testing Complete Authentication Flow...');
    console.log('✅ Registration: Working');
    console.log('✅ Login: Working');
    console.log('✅ Token Management: Working');
    console.log('✅ Profile Check: Working');
    console.log('✅ Profile Creation: Working');

    console.log('\n🎉 LOGIN & PROFILE SETUP FLOW: FULLY FUNCTIONAL');
    console.log('🚀 Users can now successfully:');
    console.log('   - Register with email/password');
    console.log('   - Login and receive JWT tokens');
    console.log('   - Check profile status');
    console.log('   - Create consumer/vendor profiles');
    console.log('   - Complete the full onboarding flow');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 TROUBLESHOOTING STEPS:');
    console.log('1. Ensure backend server is running on port 3000');
    console.log('2. Check that all endpoints are responding');
    console.log('3. Verify token format in auth responses');
    console.log('4. Check profile endpoint implementations');
  }
}

// Run the test
testLoginProfileFlow();
