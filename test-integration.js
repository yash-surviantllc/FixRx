#!/usr/bin/env node

/**
 * FixRx Frontend-Backend Integration Test Script
 * Tests the connection between frontend and backend services
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const BACKEND_URL = 'http://localhost:3000/api/v1';
const FRONTEND_URL = 'http://localhost:3001';
const TEST_TIMEOUT = 5000;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${colors.bold}=== ${message} ===${colors.reset}`, 'blue');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test Results
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

function addTestResult(name, passed, message = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    logSuccess(`${name}: ${message || 'PASSED'}`);
  } else {
    testResults.failed++;
    logError(`${name}: ${message || 'FAILED'}`);
  }
  testResults.tests.push({ name, passed, message });
}

// Test Functions
async function testBackendHealth() {
  logHeader('Testing Backend Health');
  
  try {
    const response = await axios.get(`${BACKEND_URL}/health`, {
      timeout: TEST_TIMEOUT
    });
    
    if (response.status === 200) {
      addTestResult('Backend Health Check', true, `Server responding on port 3000`);
      return true;
    } else {
      addTestResult('Backend Health Check', false, `Unexpected status: ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      addTestResult('Backend Health Check', false, 'Backend server not running on port 3000');
    } else if (error.code === 'ENOTFOUND') {
      addTestResult('Backend Health Check', false, 'Cannot resolve localhost');
    } else {
      addTestResult('Backend Health Check', false, `Connection error: ${error.message}`);
    }
    return false;
  }
}

async function testBackendAuth() {
  logHeader('Testing Backend Authentication');
  
  try {
    // Test registration endpoint
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User',
      role: 'CONSUMER'
    };
    
    const registerResponse = await axios.post(`${BACKEND_URL}/auth/register`, testUser, {
      timeout: TEST_TIMEOUT
    });
    
    if (registerResponse.status === 201 && registerResponse.data.success) {
      addTestResult('User Registration', true, 'Registration endpoint working');
      
      // Test login with the created user
      const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      }, {
        timeout: TEST_TIMEOUT
      });
      
      if (loginResponse.status === 200 && loginResponse.data.data.accessToken) {
        addTestResult('User Login', true, 'Login endpoint working');
        return loginResponse.data.data.accessToken;
      } else {
        addTestResult('User Login', false, 'Login failed');
        return null;
      }
    } else {
      addTestResult('User Registration', false, 'Registration failed');
      return null;
    }
  } catch (error) {
    if (error.response) {
      addTestResult('Backend Authentication', false, `API Error: ${error.response.status} - ${error.response.data.message || error.message}`);
    } else {
      addTestResult('Backend Authentication', false, `Network Error: ${error.message}`);
    }
    return null;
  }
}

async function testBackendEndpoints(token) {
  logHeader('Testing Backend API Endpoints');
  
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  const endpoints = [
    { name: 'Vendors Search', url: '/vendors/search?query=plumber', method: 'GET' },
    { name: 'User Profile', url: '/users/me', method: 'GET', requiresAuth: true },
    { name: 'Consumer Profile', url: '/consumers/profile', method: 'GET', requiresAuth: true }
  ];
  
  for (const endpoint of endpoints) {
    try {
      if (endpoint.requiresAuth && !token) {
        addTestResult(endpoint.name, false, 'No auth token available');
        continue;
      }
      
      const config = {
        timeout: TEST_TIMEOUT,
        headers: endpoint.requiresAuth ? headers : {}
      };
      
      const response = await axios[endpoint.method.toLowerCase()](`${BACKEND_URL}${endpoint.url}`, config);
      
      if (response.status >= 200 && response.status < 300) {
        addTestResult(endpoint.name, true, `Status: ${response.status}`);
      } else {
        addTestResult(endpoint.name, false, `Unexpected status: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        // Expected errors for some endpoints without proper setup
        if (error.response.status === 404 && endpoint.name === 'Consumer Profile') {
          addTestResult(endpoint.name, true, 'Expected 404 - profile not created yet');
        } else {
          addTestResult(endpoint.name, false, `Status: ${error.response.status}`);
        }
      } else {
        addTestResult(endpoint.name, false, `Network error: ${error.message}`);
      }
    }
  }
}

async function testFrontendHealth() {
  logHeader('Testing Frontend Health');
  
  try {
    const response = await axios.get(FRONTEND_URL, {
      timeout: TEST_TIMEOUT
    });
    
    if (response.status === 200) {
      addTestResult('Frontend Health Check', true, 'Frontend server responding');
      return true;
    } else {
      addTestResult('Frontend Health Check', false, `Unexpected status: ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      addTestResult('Frontend Health Check', false, 'Frontend server not running. Run: npm run dev');
    } else {
      addTestResult('Frontend Health Check', false, `Connection error: ${error.message}`);
    }
    return false;
  }
}

function testFileStructure() {
  logHeader('Testing File Structure');
  
  const requiredFiles = [
    // Backend files
    { path: 'backend/package.json', name: 'Backend Package' },
    { path: 'backend/.env', name: 'Backend Environment' },
    { path: 'backend/src/server.ts', name: 'Backend Server' },
    
    // Frontend files
    { path: 'frontend/package.json', name: 'Frontend Package' },
    { path: 'frontend/.env', name: 'Frontend Environment' },
    { path: 'frontend/src/main.tsx', name: 'Frontend Main' },
    
    // Integration files
    { path: 'frontend/src/lib/api-client.ts', name: 'API Client' },
    { path: 'frontend/src/services/auth.service.ts', name: 'Auth Service' },
    { path: 'frontend/src/store/auth.store.ts', name: 'Auth Store' },
    { path: 'frontend/src/IntegratedApp.tsx', name: 'Integrated App' }
  ];
  
  for (const file of requiredFiles) {
    const fullPath = path.join(__dirname, file.path);
    if (fs.existsSync(fullPath)) {
      addTestResult(file.name, true, 'File exists');
    } else {
      addTestResult(file.name, false, 'File missing');
    }
  }
}

function testConfiguration() {
  logHeader('Testing Configuration');
  
  try {
    // Check backend .env
    const backendEnv = fs.readFileSync(path.join(__dirname, 'backend/.env'), 'utf8');
    if (backendEnv.includes('PORT=3000')) {
      addTestResult('Backend Port Config', true, 'Port 3000 configured');
    } else {
      addTestResult('Backend Port Config', false, 'Port not configured correctly');
    }
    
    // Check frontend .env
    const frontendEnv = fs.readFileSync(path.join(__dirname, 'frontend/.env'), 'utf8');
    if (frontendEnv.includes('VITE_API_BASE_URL=http://localhost:3000/api/v1')) {
      addTestResult('Frontend API Config', true, 'API URL configured correctly');
    } else {
      addTestResult('Frontend API Config', false, 'API URL not configured correctly');
    }
    
    // Check package.json dependencies
    const frontendPkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'frontend/package.json'), 'utf8'));
    const requiredDeps = ['axios', 'zustand', 'react', 'typescript'];
    
    for (const dep of requiredDeps) {
      if (frontendPkg.dependencies[dep] || frontendPkg.devDependencies?.[dep]) {
        addTestResult(`Dependency: ${dep}`, true, 'Installed');
      } else {
        addTestResult(`Dependency: ${dep}`, false, 'Missing - run npm install');
      }
    }
    
  } catch (error) {
    addTestResult('Configuration Check', false, `Error reading config: ${error.message}`);
  }
}

function printSummary() {
  logHeader('Test Summary');
  
  log(`\nTotal Tests: ${testResults.total}`);
  logSuccess(`Passed: ${testResults.passed}`);
  
  if (testResults.failed > 0) {
    logError(`Failed: ${testResults.failed}`);
  }
  
  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  log(`\nSuccess Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'red');
  
  if (testResults.failed > 0) {
    log('\n--- Failed Tests ---', 'red');
    testResults.tests
      .filter(test => !test.passed)
      .forEach(test => {
        logError(`${test.name}: ${test.message}`);
      });
  }
  
  // Recommendations
  log('\n--- Recommendations ---', 'blue');
  
  if (testResults.tests.find(t => t.name === 'Backend Health Check' && !t.passed)) {
    logInfo('1. Start backend server: cd backend && npm run dev');
  }
  
  if (testResults.tests.find(t => t.name === 'Frontend Health Check' && !t.passed)) {
    logInfo('2. Start frontend server: cd frontend && npm run dev');
  }
  
  if (testResults.tests.find(t => t.name.includes('Dependency') && !t.passed)) {
    logInfo('3. Install dependencies: cd frontend && npm install');
  }
  
  if (successRate >= 80) {
    logSuccess('\n🎉 Integration is working well! You can start using the application.');
  } else {
    logWarning('\n⚠️  Some issues found. Please address the failed tests above.');
  }
}

// Main test execution
async function runTests() {
  log(`${colors.bold}${colors.blue}
╔══════════════════════════════════════════════════════════════╗
║                    FixRx Integration Test                    ║
║              Frontend ↔ Backend Connection Test             ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);
  
  // File structure and configuration tests (always run)
  testFileStructure();
  testConfiguration();
  
  // Health checks
  const backendHealthy = await testBackendHealth();
  const frontendHealthy = await testFrontendHealth();
  
  // API tests (only if backend is healthy)
  if (backendHealthy) {
    const authToken = await testBackendAuth();
    await testBackendEndpoints(authToken);
  } else {
    logWarning('Skipping API tests - backend not available');
  }
  
  // Print summary
  printSummary();
}

// Handle errors
process.on('unhandledRejection', (error) => {
  logError(`Unhandled error: ${error.message}`);
  process.exit(1);
});

// Run tests
runTests().catch(error => {
  logError(`Test execution failed: ${error.message}`);
  process.exit(1);
});
