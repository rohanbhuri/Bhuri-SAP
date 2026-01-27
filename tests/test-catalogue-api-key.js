const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3002/api';
const API_KEY = 'your_api_key_here'; // Replace with actual API key from settings

// Test API Key Authentication
async function testApiKeyAuth() {
    console.log('🔑 Testing Catalogue API with API Key Authentication\n');

    // Test 1: Get products without API key (should fail)
    console.log('Test 1: GET /catalogue/products (without API key)');
    try {
        await axios.get(`${BASE_URL}/catalogue/products`);
        console.log('❌ FAILED: Should have been rejected\n');
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✅ PASSED: Correctly rejected (401 Unauthorized)');
            console.log(`   Message: ${error.response.data.message}\n`);
        } else {
            console.log(`❌ FAILED: Unexpected error: ${error.message}\n`);
        }
    }

    // Test 2: Get products with invalid API key (should fail)
    console.log('Test 2: GET /catalogue/products (with invalid API key)');
    try {
        await axios.get(`${BASE_URL}/catalogue/products`, {
            headers: { 'X-API-Key': 'invalid_key_12345' }
        });
        console.log('❌ FAILED: Should have been rejected\n');
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✅ PASSED: Correctly rejected (401 Unauthorized)');
            console.log(`   Message: ${error.response.data.message}\n`);
        } else {
            console.log(`❌ FAILED: Unexpected error: ${error.message}\n`);
        }
    }

    // Test 3: Get products with valid API key (should succeed)
    console.log('Test 3: GET /catalogue/products (with valid API key)');
    try {
        const response = await axios.get(`${BASE_URL}/catalogue/products`, {
            headers: { 'X-API-Key': API_KEY }
        });
        console.log('✅ PASSED: Successfully retrieved products');
        console.log(`   Found ${response.data.length} products\n`);
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('❌ FAILED: API key might be invalid or expired');
            console.log(`   Message: ${error.response.data.message}`);
            console.log('   Please create a valid API key at http://localhost:4202/settings/api-keys\n');
        } else {
            console.log(`❌ FAILED: ${error.message}\n`);
        }
    }

    // Test 4: Get categories with API key as query parameter
    console.log('Test 4: GET /catalogue/categories (API key as query param)');
    try {
        const response = await axios.get(`${BASE_URL}/catalogue/categories?apiKey=${API_KEY}`);
        console.log('✅ PASSED: Successfully retrieved categories');
        console.log(`   Found ${response.data.length} categories\n`);
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('❌ FAILED: API key might be invalid or expired');
            console.log(`   Message: ${error.response.data.message}\n`);
        } else {
            console.log(`❌ FAILED: ${error.message}\n`);
        }
    }

    // Test 5: Create a test product
    console.log('Test 5: POST /catalogue/products (create product)');
    try {
        const testProduct = {
            name: 'API Test Product',
            productCode: `TEST-${Date.now()}`,
            slug: `api-test-product-${Date.now()}`,
            description: 'Product created via API for testing',
            basePrice: 99.99,
            currency: 'INR',
            isPublished: false,
            tags: ['test', 'api']
        };

        const response = await axios.post(`${BASE_URL}/catalogue/products`, testProduct, {
            headers: {
                'X-API-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ PASSED: Successfully created product');
        console.log(`   Product ID: ${response.data._id}`);
        console.log(`   Product Code: ${response.data.productCode}\n`);

        // Clean up: Delete the test product
        await axios.delete(`${BASE_URL}/catalogue/products/${response.data._id}`, {
            headers: { 'X-API-Key': API_KEY }
        });
        console.log('   ✓ Test product cleaned up\n');
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('❌ FAILED: API key might be invalid or expired');
            console.log(`   Message: ${error.response.data.message}\n`);
        } else {
            console.log(`❌ FAILED: ${error.response?.data?.message || error.message}\n`);
        }
    }

    // Test 6: Get analytics
    console.log('Test 6: GET /catalogue/analytics');
    try {
        const response = await axios.get(`${BASE_URL}/catalogue/analytics`, {
            headers: { 'X-API-Key': API_KEY }
        });
        console.log('✅ PASSED: Successfully retrieved analytics');
        console.log(`   Total Products: ${response.data.totalProducts}`);
        console.log(`   Total Categories: ${response.data.totalCategories}`);
        console.log(`   Total Collections: ${response.data.totalCollections}\n`);
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('❌ FAILED: API key might be invalid or expired');
            console.log(`   Message: ${error.response.data.message}\n`);
        } else {
            console.log(`❌ FAILED: ${error.message}\n`);
        }
    }

    console.log('🏁 Testing complete!\n');
    console.log('📝 Note: To create a valid API key:');
    console.log('   1. Go to http://localhost:4202/settings');
    console.log('   2. Click on "API Keys" under Privacy & Security');
    console.log('   3. Create a new API key with an expiry date');
    console.log('   4. Copy the token and update this script\n');
}

// Run tests
testApiKeyAuth().catch(console.error);
