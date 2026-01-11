# Client Management API Documentation

## Overview

The Client Management API provides RESTful endpoints for managing client requests and client accounts. Login/logout endpoints require API key authentication, while all other endpoints require JWT authentication.

## Base URL

```
http://localhost:3000/api/client-management
```

For production:
```
http://13.126.228.247:3000/api/client-management
```

## Authentication

### API Key Authentication (for login/logout)
Include API key in header:
```
X-API-Key: your_api_key_here
```

### JWT Authentication (for other endpoints)
Include JWT token in header:
```
Authorization: Bearer your_jwt_token_here
```

## Managing API Keys

1. Navigate to `http://localhost:4200/settings`
2. Click on "API Keys" under Privacy & Security section
3. Create a new API key with:
   - Name: Descriptive name for your integration
   - Expiry Date: When the key should expire
   - Allowed Domains: (Optional) Restrict usage to specific domains

## Authentication Endpoints

### Login
```http
POST /login
```

**Headers:**
```
X-API-Key: your_api_key_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "client@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "client@example.com",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "client": {
    "id": "507f1f77bcf86cd799439012",
    "companyName": "Acme Corp",
    "email": "client@example.com"
  },
  "roles": [
    {
      "id": "507f1f77bcf86cd799439013",
      "name": "Client",
      "type": "client"
    }
  ]
}
```

### Logout
```http
POST /logout
```

**Headers:**
```
X-API-Key: your_api_key_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "clientId": "507f1f77bcf86cd799439012"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Client Requests API

### Get All Client Requests
```http
GET /requests
```

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "clientName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "requestType": "inquiry",
    "subject": "Product Information",
    "message": "I would like to know more about your products",
    "status": "pending",
    "priority": "normal",
    "assignedTo": "507f1f77bcf86cd799439012",
    "notes": "Follow up next week",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Single Client Request
```http
GET /requests/:requestId
```

**Parameters:**
- `requestId` (string, required): Request ID

**Response:** Single client request object

### Create Client Request
```http
POST /requests
```

**Request Body:**
```json
{
  "clientName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "requestType": "inquiry",
  "subject": "Product Information",
  "message": "I would like to know more about your products",
  "priority": "normal"
}
```

**Response:** Created client request object

### Update Client Request
```http
PUT /requests/:requestId
```

**Parameters:**
- `requestId` (string, required): Request ID

**Request Body:**
```json
{
  "status": "in-progress",
  "assignedTo": "507f1f77bcf86cd799439012",
  "notes": "Contacted client, awaiting response"
}
```

**Response:** Updated client request object

### Convert Request to Client
```http
POST /requests/:requestId/convert
```

**Parameters:**
- `requestId` (string, required): Request ID

**Request Body:**
```json
{
  "accountType": "standard",
  "initialCredit": 1000,
  "notes": "Converted from inquiry"
}
```

**Response:**
```json
{
  "message": "Request converted to client successfully",
  "clientId": "507f1f77bcf86cd799439013"
}
```

## Clients API

### Get All Clients
```http
GET /clients
```

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "clientName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "accountType": "standard",
    "accountStatus": "active",
    "creditBalance": 5000,
    "totalSpent": 15000,
    "isActive": true,
    "lastActivity": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Single Client
```http
GET /clients/:clientId
```

**Parameters:**
- `clientId` (string, required): Client ID

**Response:** Single client object

### Update Client
```http
PUT /clients/:clientId
```

**Parameters:**
- `clientId` (string, required): Client ID

**Request Body:**
```json
{
  "clientName": "Jane Doe",
  "phone": "+1987654321",
  "company": "Updated Corp",
  "creditBalance": 7500
}
```

**Response:** Updated client object

### Delete Client
```http
DELETE /clients/:clientId
```

**Parameters:**
- `clientId` (string, required): Client ID

**Response:**
```json
{
  "success": true,
  "message": "Client deleted successfully"
}
```

### Toggle Client Status
```http
PUT /clients/:clientId/status
```

**Parameters:**
- `clientId` (string, required): Client ID

**Request Body:**
```json
{
  "isActive": false
}
```

**Response:** Updated client object

### Request Login Credentials
```http
POST /clients/:clientId/request-credentials
```

**Parameters:**
- `clientId` (string, required): Client ID

**Request Body:**
```json
{
  "credentialType": "email",
  "expiryDays": 7
}
```

**Response:**
```json
{
  "success": true,
  "message": "Credentials request sent successfully",
  "credentialId": "507f1f77bcf86cd799439014"
}
```

### Get Security Settings
```http
GET /clients/:clientId/security-settings
```

**Parameters:**
- `clientId` (string, required): Client ID

**Response:**
```json
{
  "clientId": "507f1f77bcf86cd799439013",
  "twoFactorEnabled": false,
  "ipWhitelist": [],
  "sessionTimeout": 3600,
  "passwordExpiry": 90,
  "lastPasswordChange": "2024-01-15T10:30:00Z",
  "loginAttempts": 0,
  "accountLocked": false
}
```

### Update Security Settings
```http
PUT /clients/:clientId/security-settings
```

**Parameters:**
- `clientId` (string, required): Client ID

**Request Body:**
```json
{
  "twoFactorEnabled": true,
  "ipWhitelist": ["192.168.1.1", "10.0.0.1"],
  "sessionTimeout": 1800,
  "passwordExpiry": 60
}
```

**Response:** Updated security settings object

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "API key is required"
}
```

```json
{
  "statusCode": 401,
  "message": "Invalid API key"
}
```

```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Client not found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Example Integration

### JavaScript/Node.js
```javascript
const API_KEY = 'your_api_key_here';
const BASE_URL = 'http://localhost:3000/api/client-management';

// Login with API key
fetch(`${BASE_URL}/login`, {
  method: 'POST',
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'client@example.com',
    password: 'password123'
  })
})
  .then(res => res.json())
  .then(data => {
    const accessToken = data.access_token;
    console.log('Logged in:', data.user);
    return accessToken;
  })
  .then(accessToken => {
    // Get all clients with JWT token
    return fetch(`${BASE_URL}/clients`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  })
  .then(res => res.json())
  .then(clients => console.log(clients));

// Logout
fetch(`${BASE_URL}/logout`, {
  method: 'POST',
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    clientId: '507f1f77bcf86cd799439013'
  })
})
  .then(res => res.json())
  .then(result => console.log(result));
```

### Python
```python
import requests

API_KEY = 'your_api_key_here'
BASE_URL = 'http://localhost:3000/api/client-management'

api_headers = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
}

# Login
response = requests.post(f'{BASE_URL}/login', headers=api_headers, json={
    'email': 'client@example.com',
    'password': 'password123'
})
login_data = response.json()
access_token = login_data['access_token']
print('Logged in:', login_data['user'])

# Get all clients with JWT token
jwt_headers = {
    'Authorization': f'Bearer {access_token}'
}
response = requests.get(f'{BASE_URL}/clients', headers=jwt_headers)
clients = response.json()

# Logout
response = requests.post(f'{BASE_URL}/logout', headers=api_headers, json={
    'clientId': '507f1f77bcf86cd799439013'
})
print(response.json())
```

### cURL
```bash
# Login with API key
LOGIN_RESPONSE=$(curl -X POST "http://localhost:3000/api/client-management/login" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "password123"
  }')

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

# Get all clients with JWT token
curl -X GET "http://localhost:3000/api/client-management/clients" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Logout
curl -X POST "http://localhost:3000/api/client-management/logout" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "507f1f77bcf86cd799439013"
  }'
```

## Support

For API support or questions, please contact the development team or refer to the in-app API documentation at `http://localhost:4200/modules/client-management` (click the 3-dot menu → API Docs).
