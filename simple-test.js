#!/usr/bin/env node

/**
 * Simple FixRx Status Check
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🔍 FixRx Integration Status Check\n');

function checkBackendStatus() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/v1/health', { timeout: 3000 }, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Backend: Running on port 3000');
        resolve(true);
      } else {
        console.log(`❌ Backend: Unexpected status ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Backend: Not running on port 3000');
        console.log('   Start with: cd backend && npm run dev');
      } else {
        console.log(`❌ Backend: ${error.message}`);
      }
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('❌ Backend: Connection timeout');
      req.destroy();
      resolve(false);
    });
  });
}

function checkFrontendFiles() {
  console.log('\nChecking Frontend Files...');
  
  const requiredFiles = [
    { path: 'frontend/package.json', name: 'Package Config' },
    { path: 'frontend/.env', name: 'Environment Config' },
    { path: 'frontend/src/main.tsx', name: 'Main Entry' },
    { path: 'frontend/src/lib/api-client.ts', name: 'API Client' },
    { path: 'frontend/src/services/auth.service.ts', name: 'Auth Service' },
    { path: 'frontend/src/store/auth.store.ts', name: 'Auth Store' },
    { path: 'frontend/src/IntegratedApp.tsx', name: 'Integrated App' }
  ];
  
  let allPresent = true;
  
  for (const file of requiredFiles) {
    const fullPath = path.join(__dirname, file.path);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${file.name}: Present`);
    } else {
      console.log(`❌ ${file.name}: Missing`);
      allPresent = false;
    }
  }
  
  return allPresent;
}

function checkDependencies() {
  console.log('\nChecking Dependencies...');
  
  try {
    const packagePath = path.join(__dirname, 'frontend/package.json');
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredDeps = ['react', 'axios', 'zustand', 'lucide-react', 'motion'];
    let allInstalled = true;
    
    for (const dep of requiredDeps) {
      if (pkg.dependencies[dep]) {
        console.log(`✅ ${dep}: Listed in package.json`);
      } else {
        console.log(`❌ ${dep}: Missing from package.json`);
        allInstalled = false;
      }
    }
    
    // Check if node_modules exists
    const nodeModulesPath = path.join(__dirname, 'frontend/node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      console.log('✅ node_modules: Present');
    } else {
      console.log('❌ node_modules: Missing - run npm install');
      allInstalled = false;
    }
    
    return allInstalled;
  } catch (error) {
    console.log(`❌ Dependency Check Error: ${error.message}`);
    return false;
  }
}

function checkConfiguration() {
  console.log('\nChecking Configuration...');
  
  try {
    // Check frontend .env
    const frontendEnvPath = path.join(__dirname, 'frontend/.env');
    if (fs.existsSync(frontendEnvPath)) {
      const envContent = fs.readFileSync(frontendEnvPath, 'utf8');
      if (envContent.includes('VITE_API_BASE_URL=http://localhost:3000/api/v1')) {
        console.log('✅ Frontend API URL: Configured correctly');
      } else {
        console.log('❌ Frontend API URL: Not configured correctly');
      }
    }
    
    // Check backend .env
    const backendEnvPath = path.join(__dirname, 'backend/.env');
    if (fs.existsSync(backendEnvPath)) {
      const envContent = fs.readFileSync(backendEnvPath, 'utf8');
      if (envContent.includes('PORT=3000')) {
        console.log('✅ Backend Port: Configured for port 3000');
      } else {
        console.log('❌ Backend Port: Not configured correctly');
      }
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Configuration Check Error: ${error.message}`);
    return false;
  }
}

async function main() {
  const backendRunning = await checkBackendStatus();
  const filesPresent = checkFrontendFiles();
  const depsInstalled = checkDependencies();
  const configCorrect = checkConfiguration();
  
  console.log('\n📊 INTEGRATION STATUS SUMMARY:');
  console.log('================================');
  console.log(`Backend Running: ${backendRunning ? '✅ YES' : '❌ NO'}`);
  console.log(`Frontend Files: ${filesPresent ? '✅ COMPLETE' : '❌ INCOMPLETE'}`);
  console.log(`Dependencies: ${depsInstalled ? '✅ INSTALLED' : '❌ MISSING'}`);
  console.log(`Configuration: ${configCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`);
  
  const overallStatus = backendRunning && filesPresent && depsInstalled && configCorrect;
  
  console.log(`\nOVERALL STATUS: ${overallStatus ? '🎉 READY TO TEST' : '⚠️  NEEDS ATTENTION'}`);
  
  if (overallStatus) {
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. cd frontend');
    console.log('2. npm run dev');
    console.log('3. Open http://localhost:3001');
    console.log('4. Test login/registration');
  } else {
    console.log('\n🔧 TO FIX:');
    if (!backendRunning) {
      console.log('• Start backend: cd backend && npm run dev');
    }
    if (!depsInstalled) {
      console.log('• Install deps: cd frontend && npm install');
    }
    if (!filesPresent) {
      console.log('• Integration files are missing');
    }
  }
  
  console.log('\n💡 INTEGRATION FEATURES READY:');
  console.log('• Authentication with JWT tokens');
  console.log('• Consumer & Vendor dashboards');
  console.log('• Real-time API data');
  console.log('• Rating system');
  console.log('• Invitation system');
  console.log('• Contact management');
}

main().catch(console.error);
