const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testDeactivateThenActivate() {
  console.log('🧪 Testing Deactivate Then Activate\n');

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

    // Get available modules
    console.log('\n2️⃣ Getting available modules...');
    const availableResponse = await axios.get(`${API_BASE}/modules/available`, { headers });
    
    const activeModule = availableResponse.data.find(m => m.isActive);
    if (!activeModule) {
      console.log('❌ No active modules found to test with');
      return;
    }

    console.log(`Found active module: ${activeModule.displayName} (${activeModule.id})`);

    // Deactivate the module
    console.log('\n3️⃣ Deactivating module...');
    const deactivationResponse = await axios.patch(`${API_BASE}/modules/${activeModule.id}/deactivate`, {}, { headers });
    
    console.log('Deactivation response:', deactivationResponse.data);

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if module is now inactive
    console.log('\n4️⃣ Checking if module is now inactive...');
    const checkResponse1 = await axios.get(`${API_BASE}/modules/available`, { headers });
    
    const deactivatedModule = checkResponse1.data.find(m => m.id === activeModule.id);
    
    if (deactivatedModule && !deactivatedModule.isActive) {
      console.log('✅ Module is now inactive');
    } else {
      console.log('❌ Module deactivation did not work');
      console.log('Module state:', deactivatedModule);
      return;
    }

    // Now reactivate the module
    console.log('\n5️⃣ Reactivating module...');
    const reactivationResponse = await axios.post(`${API_BASE}/modules/${activeModule.id}/request`, {}, { headers });
    
    console.log('Reactivation response:', reactivationResponse.data);

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if module is now active again
    console.log('\n6️⃣ Checking if module is now active again...');
    const checkResponse2 = await axios.get(`${API_BASE}/modules/available`, { headers });
    
    const reactivatedModule = checkResponse2.data.find(m => m.id === activeModule.id);
    
    if (reactivatedModule && reactivatedModule.isActive) {
      console.log('✅ Module is now active again and persisted!');
    } else {
      console.log('❌ Module reactivation did not persist');
      console.log('Module state:', reactivatedModule);
    }

    // Also check personal modules endpoint
    console.log('\n7️⃣ Checking personal modules endpoint...');
    const personalResponse = await axios.get(`${API_BASE}/modules/personal`, { headers });
    
    const personalModule = personalResponse.data.find(m => m.id === activeModule.id);
    if (personalModule) {
      console.log('✅ Module found in personal modules');
    } else {
      console.log('❌ Module not found in personal modules');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testDeactivateThenActivate();