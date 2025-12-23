const axios = require('axios');

async function testSearch() {
  try {
    // First login to get token
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@example.com', // Replace with actual admin email
      password: 'password123' // Replace with actual password
    });

    const token = loginResponse.data.access_token;
    console.log('Login successful, token:', token ? 'received' : 'missing');

    // Test search
    const searchResponse = await axios.get('http://localhost:3000/api/search', {
      params: {
        q: 'admin',
        limit: 10
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Search results:', searchResponse.data);

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testSearch();