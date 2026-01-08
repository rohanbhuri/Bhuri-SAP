# Client Management Module Tests

## Overview
This directory contains automated tests for the Client Management module.

## Test Files

### test-client-management.js
Comprehensive test suite that validates the complete client management workflow.

## Prerequisites

1. **Backend Running**: Ensure the backend server is running
   ```bash
   npm run dev
   # or
   npm run start:beax-rm
   ```

2. **Database**: MongoDB should be running and accessible

3. **Admin Account**: An admin account should exist with credentials:
   - Email: `admin@beaxrm.com`
   - Password: `admin123`
   
   (Modify in the test file if your admin credentials are different)

4. **Dependencies**: Install axios if not already installed
   ```bash
   npm install axios
   ```

## Running the Tests

### Run All Tests
```bash
cd tests
node test-client-management.js
```

### Expected Output
```
╔════════════════════════════════════════════════════════════╗
║          CLIENT MANAGEMENT MODULE TEST SUITE               ║
╚════════════════════════════════════════════════════════════╝

==================================================
Step 1: Admin Login
==================================================
✓ Admin logged in successfully
ℹ Token: eyJhbGciOiJIUzI1NiIs...

==================================================
Step 2: Create Client Request (Public)
==================================================
✓ Client request created successfully
ℹ Request ID: 507f1f77bcf86cd799439011
ℹ Email: test1234567890@example.com

==================================================
Step 3: Get All Requests (Admin)
==================================================
✓ Retrieved 5 requests
ℹ Found our request: Test Corporation
ℹ Status: PENDING

==================================================
Step 4: Convert Request to Client
==================================================
✓ Client created successfully
ℹ Client ID: 507f1f77bcf86cd799439012
ℹ Email: test1234567890@example.com
ℹ Password: aB3$xY9#mN2@
ℹ Organization: Test Corporation

==================================================
Step 5: Verify Client Creation
==================================================
✓ Client verified successfully
ℹ Company: Test Corporation
ℹ Contact: John Doe
ℹ Email: test1234567890@example.com
ℹ Phone: 9876543210
ℹ Industry: Technology
ℹ Tax ID: TAX123456
ℹ Active: true

==================================================
Step 6: Test Client Login
==================================================
✓ Client login successful
ℹ Token received: eyJhbGciOiJIUzI1NiIs...
ℹ User ID: 507f1f77bcf86cd799439013
ℹ Role: [507f1f77bcf86cd799439014]

==================================================
Step 7: Get All Clients
==================================================
✓ Retrieved 3 clients

==================================================
Step 8: Test Search and Filter
==================================================
✓ Search test passed: Found 2 matching requests

==================================================
Step 9: Cleanup (Optional)
==================================================
✓ Test client deleted successfully

==================================================
Test Summary
==================================================
Total Tests: 9
✓ Passed: 9

==================================================

✓ All tests passed! Client Management module is production ready! 🎉
```

## Test Coverage

The test suite covers:

1. **Authentication**
   - Admin login
   - Client login with generated credentials

2. **Request Management**
   - Create client request (public endpoint)
   - Retrieve all requests
   - Search and filter functionality

3. **Client Conversion**
   - Convert request to client
   - Verify all fields are saved correctly
   - Check organization creation
   - Validate user creation

4. **Client Management**
   - Retrieve all clients
   - Verify client data
   - Delete client (cleanup)

## Customization

### Change Admin Credentials
Edit the `adminCredentials` object in the test file:
```javascript
const adminCredentials = {
  email: 'your-admin@example.com',
  password: 'your-password'
};
```

### Change API URL
Edit the `API_URL` constant:
```javascript
const API_URL = 'http://your-server:3000/api';
```

### Skip Cleanup
Comment out the cleanup step in the `tests` array:
```javascript
const tests = [
  // ... other tests
  // { name: 'Cleanup', fn: cleanup }  // Commented out
];
```

### Add Custom Tests
Add new test functions and include them in the tests array:
```javascript
async function myCustomTest() {
  log.section('My Custom Test');
  try {
    // Your test logic here
    log.success('Test passed');
    return true;
  } catch (error) {
    log.error('Test failed: ' + error.message);
    return false;
  }
}

const tests = [
  // ... existing tests
  { name: 'My Custom Test', fn: myCustomTest }
];
```

## Troubleshooting

### Error: Admin login failed
- Verify backend is running
- Check admin credentials
- Ensure database is accessible

### Error: Failed to create request
- Check if email is unique
- Verify API endpoint is correct
- Check backend logs for errors

### Error: Failed to convert
- Ensure request exists
- Verify admin token is valid
- Check if request is already converted

### Error: Client login failed
- Verify credentials were generated correctly
- Check if user was created in database
- Ensure CLIENT role exists

## Manual Testing

If automated tests fail, you can test manually:

### 1. Create Request
```bash
curl -X POST http://localhost:3000/api/client-management/requests \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Corp",
    "contactPerson": "John Doe",
    "email": "test@example.com",
    "phone": "1234567890"
  }'
```

### 2. Login as Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@beaxrm.com",
    "password": "admin123"
  }'
```

### 3. Get Requests
```bash
curl -X GET http://localhost:3000/api/client-management/requests \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Convert to Client
```bash
curl -X POST http://localhost:3000/api/client-management/requests/REQUEST_ID/convert \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "notes": "Test client"
  }'
```

## CI/CD Integration

To integrate with CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Client Management Tests
  run: |
    npm run dev &
    sleep 10
    cd tests
    node test-client-management.js
```

## Best Practices

1. **Run tests before deployment**: Always run the test suite before deploying to production
2. **Check test output**: Review the output for any warnings or errors
3. **Clean up test data**: The cleanup step removes test data, but verify manually if needed
4. **Update tests**: When adding new features, update the test suite accordingly
5. **Monitor logs**: Check backend logs if tests fail unexpectedly

## Related Documentation

- [Client Management Production Ready](../documentation/CLIENT_MANAGEMENT_PRODUCTION_READY.md)
- [Client Management Quick Reference](../documentation/CLIENT_MANAGEMENT_QUICK_REFERENCE.md)
- [Implementation Summary](../documentation/CLIENT_MANAGEMENT_IMPLEMENTATION_SUMMARY.md)

## Support

For issues with tests:
1. Check backend logs: `npm run pm2:logs`
2. Verify database connectivity
3. Ensure all prerequisites are met
4. Review the test output for specific error messages
