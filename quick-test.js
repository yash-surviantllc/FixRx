#!/usr/bin/env node

/**
 * Quick FixRx Integration Test
 * Tests basic backend connectivity and frontend setup
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:3000/api/v1';

console.log('🔍 FixRx Integration Quick Test\n');

async function testBackend() {
  console.log('Testing Backend...');
  
  try {
    // Test basic health
    const healthResponse = await axios.get(`${BACKEND_URL}/health`, { timeout: 5000 });
    console.log('✅ Backend Health: OK');
    
    // Test auth endpoint
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'testpass123',
      firstName: 'Test',
      lastName: 'User',
      role: 'CONSUMER'
    };
    
    const registerResponse = await axios.post(`${BACKEND_URL}/auth/register`, testUser, { timeout: 5000 });
    if (registerResponse.status === 201) {
      console.log('✅ Backend Auth: Registration working');
      
      const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      }, { timeout: 5000 });
      
      if (loginResponse.status === 200 && loginResponse.data.data.accessToken) {
        console.log('✅ Backend Auth: Login working');
        console.log('✅ Backend: FULLY OPERATIONAL');
        return true;
      }
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend: Not running on port 3000');
      console.log('   Start with: cd backend && npm run dev');
    } else {
      console.log(`❌ Backend Error: ${error.message}`);
    }
    return false;
  }
}

function testFrontendSetup() {
  console.log('\nTesting Frontend Setup...');
  
  try {
    // Check package.json
    const packagePath = path.join(__dirname, 'frontend/package.json');
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const requiredDeps = ['react', 'axios', 'zustand'];
      
      let allDepsPresent = true;
      for (const dep of requiredDeps) {
        if (pkg.dependencies[dep]) {
          console.log(`✅ Dependency ${dep}: Installed`);
        } else {
          console.log(`❌ Dependency ${dep}: Missing`);
          allDepsPresent = false;
        }
      }
      
      if (allDepsPresent) {
        console.log('✅ Frontend Dependencies: OK');
      }
    }
    
    // Check environment
    const envPath = path.join(__dirname, 'frontend/.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('VITE_API_BASE_URL=http://localhost:3000/api/v1')) {
        console.log('✅ Frontend Config: API URL configured');
      } else {
        console.log('❌ Frontend Config: API URL not configured');
      }
    }
    
    // Check integration files
    const integrationFiles = [
      'frontend/src/lib/api-client.ts',
      'frontend/src/services/auth.service.ts',
      'frontend/src/store/auth.store.ts',
      'frontend/src/IntegratedApp.tsx'
    ];
    
    let allFilesPresent = true;
    for (const file of integrationFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ Integration File: ${file.split('/').pop()}`);
      } else {
        console.log(`❌ Integration File: ${file.split('/').pop()} missing`);
        allFilesPresent = false;
      }
    }
    
    if (allFilesPresent) {
      console.log('✅ Frontend Integration: Files present');
    }
    
    return allFilesPresent;
    
  } catch (error) {
    console.log(`❌ Frontend Setup Error: ${error.message}`);
    return false;
  }
}

async function main() {
  const backendWorking = await testBackend();
  const frontendSetup = testFrontendSetup();
  
  console.log('\n📊 SUMMARY:');
  console.log(`Backend: ${backendWorking ? '✅ Working' : '❌ Issues'}`);
  console.log(`Frontend: ${frontendSetup ? '✅ Setup Complete' : '❌ Setup Issues'}`);
  
  if (backendWorking && frontendSetup) {
    console.log('\n🎉 INTEGRATION STATUS: READY TO TEST');
    console.log('\nNext Steps:');
    console.log('1. cd frontend && npm run dev');
    console.log('2. Open http://localhost:3001');
    console.log('3. Test registration/login flow');
  } else {
    console.log('\n⚠️  INTEGRATION STATUS: NEEDS ATTENTION');
    if (!backendWorking) {
      console.log('- Start backend: cd backend && npm run dev');
    }
    if (!frontendSetup) {
      console.log('- Install frontend deps: cd frontend && npm install');
    }
  }
}

main().catch(console.error);
