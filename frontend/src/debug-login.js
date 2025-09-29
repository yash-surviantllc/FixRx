// Debug login to see exact response structure
async function debugLogin() {
  try {
    console.log('🔍 Debug Login Test');
    
    const loginData = {
      email: 'test@example.com',
      password: 'testpass123'
    };

    console.log('📤 Sending login request:', loginData);

    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    console.log('📊 Response status:', response.status);
    console.log('📋 Response headers:', response.headers);

    const data = await response.json();
    console.log('📦 Raw response data:', data);
    console.log('👤 User object:', data.user);
    console.log('🔑 User role:', data.user?.role);
    console.log('🎫 Token:', data.token);
    
    // Test the transformation logic
    const authResponse = {
      user: data.user,
      accessToken: data.token || data.accessToken,
      refreshToken: data.refreshToken || data.token,
    };
    
    console.log('🔄 Transformed response:', authResponse);
    console.log('✅ Has user?', !!authResponse.user);
    console.log('✅ Has user.role?', !!authResponse.user?.role);
    console.log('✅ User role value:', authResponse.user?.role);
    
  } catch (error) {
    console.error('❌ Debug login error:', error);
  }
}

// Run the debug
debugLogin();
