#!/usr/bin/env node

/**
 * Test Registration Directly
 */

const http = require('http');

function testRegistration() {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'testpass123',
    firstName: 'Test',
    lastName: 'User',
    role: 'CONSUMER'
  };

  const postData = JSON.stringify(testUser);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/v1/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('🧪 Testing Registration...');
  console.log('📧 Test User:', testUser);

  const req = http.request(options, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('\n📦 Raw Response:');
      console.log(data);
      
      try {
        const jsonData = JSON.parse(data);
        console.log('\n✨ Parsed Response:');
        console.log(JSON.stringify(jsonData, null, 2));
        
        if (jsonData.success) {
          console.log('\n✅ Registration Success!');
          if (jsonData.data && jsonData.data.user) {
            console.log('👤 User:', jsonData.data.user);
          }
        } else {
          console.log('\n❌ Registration Failed:');
          console.log('Error:', jsonData.message || 'Unknown error');
        }
      } catch (error) {
        console.log('\n❌ Failed to parse JSON response');
        console.log('Parse Error:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.log('\n🚨 Request Error:');
    console.log(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solution: Make sure backend is running');
      console.log('   Run: cd backend && node test-server.js');
    }
  });

  req.write(postData);
  req.end();
}

// Test backend health first
function testHealth() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/v1/health', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Backend is running');
        resolve(true);
      } else {
        console.log(`❌ Backend health check failed: ${res.statusCode}`);
        resolve(false);
      }
    });

    req.on('error', (error) => {
      console.log('❌ Backend not accessible:', error.message);
      resolve(false);
    });
  });
}

async function main() {
  console.log('🔍 FixRx Registration Test\n');
  
  const isHealthy = await testHealth();
  
  if (isHealthy) {
    console.log('');
    testRegistration();
  } else {
    console.log('\n💡 Start backend first:');
    console.log('   cd backend && node test-server.js');
  }
}

main();
