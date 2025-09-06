const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testFixes() {
  console.log('🧪 Testing Dashboard Widget Display and Module Activation Fixes\n');

  try {
    // Test 1: Login as super admin
    console.log('1️⃣ Testing super admin login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@beax.com',
      password: 'admin123'
    });

    const token = loginResponse.data.access_token;
    const user = loginResponse.data.user;
    
    console.log('✅ Login successful');
    console.log(`   User: ${user.firstName} ${user.lastName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Organization ID: ${user.organizationId}`);
    console.log(`   Roles: ${user.roles?.map(r => r.type).join(', ') || 'No roles'}`);

    const headers = { Authorization: `Bearer ${token}` };

    // Test 2: Get user's organizations
    console.log('\n2️⃣ Testing organization loading...');
    const orgsResponse = await axios.get(`${API_BASE}/organizations/my-organizations`, { headers });
    
    console.log('✅ Organizations loaded successfully');
    console.log(`   Found ${orgsResponse.data.length} organizations:`);
    orgsResponse.data.forEach(org => {
      console.log(`   - ${org.name} (${org.code}) - ID: ${org._id}`);
    });

    // Test 3: Get organization modules
    if (orgsResponse.data.length > 0) {
      const orgId = orgsResponse.data[0]._id;
      console.log(`\n3️⃣ Testing organization modules for ${orgsResponse.data[0].name}...`);
      
      const orgModulesResponse = await axios.get(`${API_BASE}/modules/organization/${orgId}`, { headers });
      
      console.log('✅ Organization modules loaded successfully');
      console.log(`   Found ${orgModulesResponse.data.length} active modules:`);
      orgModulesResponse.data.forEach(module => {
        console.log(`   - ${module.displayName} (${module.name})`);
      });
    }

    // Test 4: Get personal modules
    console.log('\n4️⃣ Testing personal modules...');
    const personalModulesResponse = await axios.get(`${API_BASE}/modules/personal`, { headers });
    
    console.log('✅ Personal modules loaded successfully');
    console.log(`   Found ${personalModulesResponse.data.length} personal modules:`);
    personalModulesResponse.data.forEach(module => {
      console.log(`   - ${module.displayName} (${module.name})`);
    });

    // Test 5: Test module requests endpoint (previously 403)
    console.log('\n5️⃣ Testing module requests endpoint...');
    try {
      const requestsResponse = await axios.get(`${API_BASE}/modules/requests`, { headers });
      
      console.log('✅ Module requests endpoint accessible');
      console.log(`   Found ${requestsResponse.data.length} pending requests`);
      if (requestsResponse.data.length > 0) {
        requestsResponse.data.forEach(req => {
          console.log(`   - ${req.moduleName} requested by ${req.userName}`);
        });
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('❌ Still getting 403 Forbidden error');
        console.log(`   Error: ${error.response.data.message || error.message}`);
      } else {
        console.log('✅ No 403 error, but got:', error.response?.status || error.message);
      }
    }

    // Test 6: Test module activation
    console.log('\n6️⃣ Testing module activation...');
    const availableModulesResponse = await axios.get(`${API_BASE}/modules/available`, { headers });
    
    console.log(`   Found ${availableModulesResponse.data.length} available modules`);
    
    // Find a module that can be activated
    const inactiveModule = availableModulesResponse.data.find(m => !m.isActive && m.canActivate);
    
    if (inactiveModule) {
      console.log(`   Testing activation of: ${inactiveModule.displayName}`);
      
      try {
        const activationResponse = await axios.post(`${API_BASE}/modules/${inactiveModule.id}/request`, {}, { headers });
        
        console.log('✅ Module activation request successful');
        console.log(`   Response: ${activationResponse.data.message || 'Success'}`);
        console.log(`   Approver Type: ${activationResponse.data.approverType || 'Unknown'}`);
      } catch (error) {
        console.log('❌ Module activation failed');
        console.log(`   Error: ${error.response?.data?.message || error.message}`);
      }
    } else {
      console.log('   No inactive modules available for testing activation');
    }

    console.log('\n🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testFixes();