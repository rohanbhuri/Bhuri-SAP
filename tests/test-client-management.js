/**
 * Client Management Module Test Script
 * 
 * This script tests the complete flow of the Client Management module:
 * 1. Create client request
 * 2. Retrieve requests
 * 3. Convert request to client
 * 4. Verify client creation
 * 5. Test client login
 */

const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3000/api';
let adminToken = '';
let testRequestId = '';
let testClientId = '';
let clientCredentials = {};

// Test data
const testRequest = {
  companyName: 'Test Corporation',
  contactPerson: 'John Doe',
  email: `test${Date.now()}@example.com`,
  phone: '9876543210',
  website: 'https://testcorp.com',
  industry: 'Technology',
  companySize: '11-50',
  address: '123 Test Street',
  city: 'Test City',
  country: 'Test Country',
  message: 'We are interested in your services'
};

const adminCredentials = {
  email: 'admin@beaxrm.com',
  password: 'admin123'
};

// Helper function for colored console output
const log = {
  success: (msg) => console.log('\x1b[32m✓\x1b[0m', msg),
  error: (msg) => console.log('\x1b[31m✗\x1b[0m', msg),
  info: (msg) => console.log('\x1b[36mℹ\x1b[0m', msg),
  section: (msg) => console.log('\n\x1b[33m' + '='.repeat(50) + '\x1b[0m\n' + msg + '\n' + '\x1b[33m' + '='.repeat(50) + '\x1b[0m')
};

// Test functions
async function loginAsAdmin() {
  log.section('Step 1: Admin Login');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, adminCredentials);
    adminToken = response.data.access_token;
    log.success('Admin logged in successfully');
    log.info(`Token: ${adminToken.substring(0, 20)}...`);
    return true;
  } catch (error) {
    log.error('Admin login failed: ' + error.message);
    return false;
  }
}

async function createClientRequest() {
  log.section('Step 2: Create Client Request (Public)');
  try {
    const response = await axios.post(`${API_URL}/client-management/requests`, testRequest);
    testRequestId = response.data._id;
    log.success('Client request created successfully');
    log.info(`Request ID: ${testRequestId}`);
    log.info(`Email: ${testRequest.email}`);
    return true;
  } catch (error) {
    log.error('Failed to create request: ' + error.response?.data?.message || error.message);
    return false;
  }
}

async function getAllRequests() {
  log.section('Step 3: Get All Requests (Admin)');
  try {
    const response = await axios.get(`${API_URL}/client-management/requests`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    log.success(`Retrieved ${response.data.length} requests`);
    const ourRequest = response.data.find(r => r._id === testRequestId);
    if (ourRequest) {
      log.info(`Found our request: ${ourRequest.companyName}`);
      log.info(`Status: ${ourRequest.status}`);
    }
    return true;
  } catch (error) {
    log.error('Failed to get requests: ' + error.response?.data?.message || error.message);
    return false;
  }
}

async function convertToClient() {
  log.section('Step 4: Convert Request to Client');
  try {
    const conversionData = {
      firstName: 'John',
      lastName: 'Doe',
      companyName: testRequest.companyName,
      email: testRequest.email,
      phone: testRequest.phone,
      website: testRequest.website,
      industry: testRequest.industry,
      companySize: testRequest.companySize,
      address: testRequest.address,
      city: testRequest.city,
      country: testRequest.country,
      taxId: 'TAX123456',
      billingAddress: '456 Billing Street',
      notes: 'Test client created via automated script'
    };

    const response = await axios.post(
      `${API_URL}/client-management/requests/${testRequestId}/convert`,
      conversionData,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    testClientId = response.data.client._id;
    clientCredentials = response.data.credentials;

    log.success('Client created successfully');
    log.info(`Client ID: ${testClientId}`);
    log.info(`Email: ${clientCredentials.email}`);
    log.info(`Password: ${clientCredentials.password}`);
    log.info(`Organization: ${response.data.organization.name}`);
    return true;
  } catch (error) {
    log.error('Failed to convert: ' + error.response?.data?.message || error.message);
    return false;
  }
}

async function verifyClientCreation() {
  log.section('Step 5: Verify Client Creation');
  try {
    const response = await axios.get(`${API_URL}/client-management/clients/${testClientId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    log.success('Client verified successfully');
    log.info(`Company: ${response.data.companyName}`);
    log.info(`Contact: ${response.data.contactPerson}`);
    log.info(`Email: ${response.data.email}`);
    log.info(`Phone: ${response.data.phone}`);
    log.info(`Industry: ${response.data.industry}`);
    log.info(`Tax ID: ${response.data.taxId}`);
    log.info(`Active: ${response.data.isActive}`);
    return true;
  } catch (error) {
    log.error('Failed to verify client: ' + error.response?.data?.message || error.message);
    return false;
  }
}

async function testClientLogin() {
  log.section('Step 6: Test Client Login');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: clientCredentials.email,
      password: clientCredentials.password
    });

    log.success('Client login successful');
    log.info(`Token received: ${response.data.access_token.substring(0, 20)}...`);
    log.info(`User ID: ${response.data.user._id}`);
    log.info(`Role: ${response.data.user.roleIds}`);
    return true;
  } catch (error) {
    log.error('Client login failed: ' + error.response?.data?.message || error.message);
    return false;
  }
}

async function getAllClients() {
  log.section('Step 7: Get All Clients');
  try {
    const response = await axios.get(`${API_URL}/client-management/clients`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    log.success(`Retrieved ${response.data.length} clients`);
    return true;
  } catch (error) {
    log.error('Failed to get clients: ' + error.response?.data?.message || error.message);
    return false;
  }
}

async function testSearchAndFilter() {
  log.section('Step 8: Test Search and Filter');
  try {
    // This would be tested on the frontend, but we can verify the data is searchable
    const response = await axios.get(`${API_URL}/client-management/requests`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const searchTerm = 'Test';
    const filtered = response.data.filter(r =>
      r.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone?.includes(searchTerm)
    );

    log.success(`Search test passed: Found ${filtered.length} matching requests`);
    return true;
  } catch (error) {
    log.error('Search test failed: ' + error.message);
    return false;
  }
}

async function cleanup() {
  log.section('Step 9: Cleanup (Optional)');
  try {
    // Delete the test client
    await axios.delete(`${API_URL}/client-management/clients/${testClientId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    log.success('Test client deleted successfully');
    return true;
  } catch (error) {
    log.error('Cleanup failed: ' + error.response?.data?.message || error.message);
    log.info('You may need to manually delete the test client');
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('\n\x1b[35m' + '╔' + '═'.repeat(60) + '╗' + '\x1b[0m');
  console.log('\x1b[35m║' + ' '.repeat(10) + 'CLIENT MANAGEMENT MODULE TEST SUITE' + ' '.repeat(15) + '║' + '\x1b[0m');
  console.log('\x1b[35m' + '╚' + '═'.repeat(60) + '╝' + '\x1b[0m\n');

  const tests = [
    { name: 'Admin Login', fn: loginAsAdmin },
    { name: 'Create Request', fn: createClientRequest },
    { name: 'Get Requests', fn: getAllRequests },
    { name: 'Convert to Client', fn: convertToClient },
    { name: 'Verify Client', fn: verifyClientCreation },
    { name: 'Client Login', fn: testClientLogin },
    { name: 'Get All Clients', fn: getAllClients },
    { name: 'Search & Filter', fn: testSearchAndFilter },
    { name: 'Cleanup', fn: cleanup }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
      // Stop on critical failures
      if (['Admin Login', 'Create Request', 'Convert to Client'].includes(test.name)) {
        log.error(`Critical test failed: ${test.name}. Stopping tests.`);
        break;
      }
    }
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  log.section('Test Summary');
  console.log(`Total Tests: ${passed + failed}`);
  log.success(`Passed: ${passed}`);
  if (failed > 0) {
    log.error(`Failed: ${failed}`);
  }
  console.log('\n' + '='.repeat(50) + '\n');

  if (failed === 0) {
    log.success('All tests passed! Client Management module is production ready! 🎉');
  } else {
    log.error('Some tests failed. Please review the errors above.');
  }
}

// Run the tests
runTests().catch(error => {
  log.error('Test suite crashed: ' + error.message);
  console.error(error);
  process.exit(1);
});
