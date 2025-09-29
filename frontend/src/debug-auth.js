// Debug script to test authentication
async function testAuth() {
  try {
    console.log('Testing registration...');
    
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'testpass123',
      firstName: 'Test',
      lastName: 'User',
      role: 'CONSUMER'
    };

    const response = await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();
    console.log('Raw response:', response);
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    console.log('Data structure:', JSON.stringify(data, null, 2));
    
    if (data.data) {
      console.log('data.data:', data.data);
      console.log('data.data.user:', data.data.user);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();
