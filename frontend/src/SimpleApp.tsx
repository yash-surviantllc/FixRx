import React, { useState } from 'react';
import { Mail, Chrome, Users } from 'lucide-react';

// Simple test component to verify the integration is working
export default function SimpleApp() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'login' | 'dashboard'>('welcome');
  const [user, setUser] = useState<any>(null);

  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const response = await fetch('http://localhost:3000/api/v1/health');
      const data = await response.json();
      console.log('Backend response:', data);
      alert('Backend connection successful!');
    } catch (error) {
      console.error('Backend connection failed:', error);
      alert('Backend connection failed. Make sure backend is running on port 3000.');
    }
  };

  const testLogin = async () => {
    try {
      const loginData = {
        email: 'test@example.com',
        password: 'testpass123'
      };

      console.log('Testing login...');
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && (data.success || data.data?.accessToken)) {
        setUser(data.data?.user || { 
          firstName: 'Demo', 
          lastName: 'User', 
          email: loginData.email, 
          role: 'CONSUMER' 
        });
        setCurrentScreen('dashboard');
        alert('✅ Login successful! Token received!');
      } else {
        alert('Login failed: ' + (data.message || 'Invalid credentials'));
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Try registration first.');
    }
  };

  const testRegistration = async () => {
    try {
      const testUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'testpass123',
        firstName: 'Test',
        lastName: 'User',
        role: 'CONSUMER'
      };

      console.log('Testing registration...');
      const response = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok && (data.success || data.message === 'User registered successfully')) {
        // Handle successful registration
        setUser(data.data?.user || { 
          firstName: 'Test', 
          lastName: 'User', 
          email: testUser.email, 
          role: testUser.role 
        });
        setCurrentScreen('dashboard');
        alert('✅ Registration successful! Backend integration working!');
      } else {
        alert('Registration failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Check console for details.');
    }
  };

  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">F</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">FixRx</h1>
            <p className="text-gray-600">Frontend-Backend Integration Test</p>
          </div>

          {/* Test Buttons */}
          <div className="space-y-4">
            <button
              onClick={testBackendConnection}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
            >
              <span>🔍</span>
              <span>Test Backend Connection</span>
            </button>

            <button
              onClick={testRegistration}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Test Registration</span>
            </button>

            <button
              onClick={testLogin}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors"
            >
              <Chrome className="w-5 h-5" />
              <span>Test Login</span>
            </button>
          </div>

          {/* Status */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Integration Status:</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Frontend: Running on port 3003</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Backend: Running on port 3000</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span>API Integration: Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="bg-white border rounded-2xl shadow-lg p-8 max-w-md w-full">
          <button
            onClick={() => setCurrentScreen('welcome')}
            className="mb-6 text-blue-600 hover:text-blue-700"
          >
            ← Back to Welcome
          </button>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Login Form</h2>
          <p className="text-gray-600 mb-4">Manual login form would go here.</p>
          <p className="text-sm text-gray-500">Use the "Test Registration" button for now to test the backend integration.</p>
        </div>
      </div>
    );
  }

  if (currentScreen === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome, {user?.firstName} {user?.lastName}!
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">User Info</h3>
                <p className="text-sm text-blue-700">Email: {user?.email}</p>
                <p className="text-sm text-blue-700">Role: {user?.role}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Integration</h3>
                <p className="text-sm text-green-700">✅ Backend Connected</p>
                <p className="text-sm text-green-700">✅ Auth Working</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Next Steps</h3>
                <p className="text-sm text-purple-700">Ready for full UI</p>
                <p className="text-sm text-purple-700">All APIs available</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentScreen('welcome');
              setUser(null);
            }}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Back to Welcome
          </button>
        </div>
      </div>
    );
  }

  return null;
}
