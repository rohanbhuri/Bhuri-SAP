const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testPersonalActivation() {
  console.log('🧪 Testing Personal Module Activation\n');

  try {
    // Login as super admin
    console.log('1️⃣ Logging in as super admin...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@beax.com',
      password: 'admin123'
    });

    const token = loginResponse.data.access_token;
    const headers = { Authorization: `Bearer ${token}` };

    console.log('✅ Login successful');

    // Get available modules (should show current state)
    console.log('\n2️⃣ Getting available modules...');
    const availableResponse = await axios.get(`${API_BASE}/modules/available`, { headers });
    
    const inactiveModule = availableResponse.data.find(m => !m.isActive);
    if (!inactiveModule) {
      console.log('❌ No inactive modules found to test with');
      return;
    }

    console.log(`Found inactive module: ${inactiveModule.displayName} (${inactiveModule.id})`);

    // Activate the module
    console.log('\n3️⃣ Activating module...');
    const activationResponse = await axios.post(`${API_BASE}/modules/${inactiveModule.id}/request`, {}, { headers });
    
    console.log('Activation response:', activationResponse.data);

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if module is now active
    console.log('\n4️⃣ Checking if module is now active...');
    const checkResponse = await axios.get(`${API_BASE}/modules/available`, { headers });
    
    const activatedModule = checkResponse.data.find(m => m.id === inactiveModule.id);
    
    if (activatedModule && activatedModule.isActive) {
      console.log('✅ Module is now active and persisted!');
    } else {
      console.log('❌ Module activation did not persist');
      console.log('Module state:', activatedModule);
    }

    // Also check personal modules endpoint
    console.log('\n5️⃣ Checking personal modules endpoint...');
    const personalResponse = await axios.get(`${API_BASE}/modules/personal`, { headers });
    
    const personalModule = personalResponse.data.find(m => m.id === inactiveModule.id);
    if (personalModule) {
      console.log('✅ Module found in personal modules');
    } else {
      console.log('❌ Module not found in personal modules');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testPersonalActivation();