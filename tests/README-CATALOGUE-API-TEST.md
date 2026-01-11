# Catalogue API Key Test

## Overview

This test script validates the API key authentication system for the Catalogue Management API.

## Prerequisites

1. Backend server running on `http://localhost:3002`
2. Valid API key created from settings page
3. Node.js with axios installed

## Setup

1. Create an API key:
   - Navigate to `http://localhost:4202/settings/api-keys`
   - Click "Create API Key"
   - Set name (e.g., "Test Key") and expiry date (future date)
   - Copy the generated token

2. Update the test script:
   ```javascript
   const API_KEY = 'your_api_key_here'; // Replace with your token
   ```

## Running the Test

```bash
cd tests
node test-catalogue-api-key.js
```

## Test Cases

The script runs 6 test cases:

1. **No API Key** - Verifies 401 rejection
2. **Invalid API Key** - Verifies 401 rejection
3. **Valid API Key (Header)** - Verifies successful access
4. **Valid API Key (Query)** - Verifies query parameter method
5. **Create Product** - Verifies POST with API key
6. **Get Analytics** - Verifies analytics endpoint access

## Expected Output

```
🔑 Testing Catalogue API with API Key Authentication

Test 1: GET /catalogue/products (without API key)
✅ PASSED: Correctly rejected (401 Unauthorized)
   Message: API key is required

Test 2: GET /catalogue/products (with invalid API key)
✅ PASSED: Correctly rejected (401 Unauthorized)
   Message: Invalid API key

Test 3: GET /catalogue/products (with valid API key)
✅ PASSED: Successfully retrieved products
   Found 0 products

Test 4: GET /catalogue/categories (API key as query param)
✅ PASSED: Successfully retrieved categories
   Found 0 categories

Test 5: POST /catalogue/products (create product)
✅ PASSED: Successfully created product
   Product ID: 507f1f77bcf86cd799439011
   Product Code: TEST-1234567890
   ✓ Test product cleaned up

Test 6: GET /catalogue/analytics
✅ PASSED: Successfully retrieved analytics
   Total Products: 0
   Total Categories: 0
   Total Collections: 0

🏁 Testing complete!
```

## Troubleshooting

### "API key might be invalid or expired"

**Solution:**
1. Check if API key is active in settings
2. Verify expiry date hasn't passed
3. Ensure token is copied correctly (no extra spaces)
4. Create a new API key if needed

### "Connection refused"

**Solution:**
1. Ensure backend is running: `npm run start:raccontixrm` (or appropriate brand)
2. Check backend is on port 3002
3. Verify MongoDB is running

### "Cannot find module 'axios'"

**Solution:**
```bash
npm install axios
```

## Manual Testing

You can also test manually with cURL:

```bash
# Test without API key (should fail)
curl http://localhost:3002/api/catalogue/products

# Test with API key (should succeed)
curl -H "X-API-Key: your_token_here" \
  http://localhost:3002/api/catalogue/products

# Test with query parameter
curl "http://localhost:3002/api/catalogue/products?apiKey=your_token_here"
```

## Integration Testing

For integration with external websites:

1. Create API key with allowed domains
2. Use the token in your website's API calls
3. Monitor usage in settings page
4. Check last used timestamp to verify activity

## Related Documentation

- **API Documentation:** `/documentation/CATALOGUE_API_DOCUMENTATION.md`
- **Implementation Guide:** `/documentation/CATALOGUE_API_KEY_INTEGRATION.md`
- **Quick Reference:** `/documentation/CATALOGUE_API_QUICK_REFERENCE.md`
