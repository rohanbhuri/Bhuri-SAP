# User Management API Documentation

## Overview

The User Management API provides RESTful endpoints for managing users, roles, permissions, and organizations. Login/logout endpoints require API key authentication, while all other endpoints require JWT authentication.

## Base URL

```
http://localhost:3000/api/user-management
```

For production:
```
http://13.126.228.247:3000/api/user-management
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
  "email": "user@example.com",
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
    "email": "john@example.com",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "roles": [
    {
      "id": "507f1f77bcf86cd799439013",
      "name": "Admin",
      "type": "admin"
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
  "userId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Users API

### Get All Users
```http
GET /users
```

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Query Parameters:**
- `search` (string, optional): Search users by name or email

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "organizationId": "507f1f77bcf86cd799439012",
    "roleIds": ["507f1f77bcf86cd799439013"],
    "isActive": true,
    "lastLogin": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Single User
```http
GET /users/:userId
```

**Parameters:**
- `userId` (string, required): User ID

**Response:** Single user object

### Create User
```http
POST /users
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepassword123",
  "organizationId": "507f1f77bcf86cd799439012",
  "roleIds": ["507f1f77bcf86cd799439013"],
  "isActive": true
}
```

**Response:** Created user object

### Update User
```http
PUT /users/:userId
```

**Parameters:**
- `userId` (string, required): User ID

**Request Body:** Partial user object with fields to update

**Response:** Updated user object

### Delete User
```http
DELETE /users/:userId
```

**Parameters:**
- `userId` (string, required): User ID

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Toggle User Status
```http
PUT /users/:userId/status
```

**Parameters:**
- `userId` (string, required): User ID

**Request Body:**
```json
{
  "isActive": true
}
```

**Response:** Updated user object

### Update User Roles
```http
PUT /users/:userId/roles
```

**Parameters:**
- `userId` (string, required): User ID

**Request Body:**
```json
{
  "roleIds": ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"]
}
```

**Response:** Updated user object

### Search Users
```http
GET /users?search=john
```

**Query Parameters:**
- `search` (string, required): Search term

**Response:** Array of matching user objects

## Organizations API

### Get All Organizations
```http
GET /organizations
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Acme Corporation",
    "description": "Leading company in innovation",
    "website": "https://acme.com",
    "email": "contact@acme.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, Country",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

## Roles API

### Get All Roles
```http
GET /roles
```

**Query Parameters:**
- `search` (string, optional): Search roles by name

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Admin",
    "description": "Administrative access",
    "type": "admin",
    "hierarchyLevel": 3,
    "permissionIds": ["507f1f77bcf86cd799439014"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Create Role
```http
POST /roles
```

**Request Body:**
```json
{
  "name": "Manager",
  "description": "Manager access",
  "type": "staff",
  "hierarchyLevel": 2,
  "permissionIds": ["507f1f77bcf86cd799439014", "507f1f77bcf86cd799439015"]
}
```

**Response:** Created role object

### Update Role
```http
PUT /roles/:roleId
```

**Parameters:**
- `roleId` (string, required): Role ID

**Request Body:** Partial role object with fields to update

**Response:** Updated role object

### Delete Role
```http
DELETE /roles/:roleId
```

**Parameters:**
- `roleId` (string, required): Role ID

**Response:**
```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

### Search Roles
```http
GET /roles?search=admin
```

**Query Parameters:**
- `search` (string, required): Search term

**Response:** Array of matching role objects

## Permissions API

### Get All Permissions
```http
GET /permissions
```

**Query Parameters:**
- `search` (string, optional): Search permissions by module or action

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "module": "user-management",
    "action": "read",
    "resource": "users",
    "description": "View users",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Create Permission
```http
POST /permissions
```

**Request Body:**
```json
{
  "module": "user-management",
  "action": "create",
  "resource": "users",
  "description": "Create new users"
}
```

**Response:** Created permission object

### Update Permission
```http
PUT /permissions/:permissionId
```

**Parameters:**
- `permissionId` (string, required): Permission ID

**Request Body:** Partial permission object with fields to update

**Response:** Updated permission object

### Delete Permission
```http
DELETE /permissions/:permissionId
```

**Parameters:**
- `permissionId` (string, required): Permission ID

**Response:**
```json
{
  "success": true,
  "message": "Permission deleted successfully"
}
```

### Search Permissions
```http
GET /permissions?search=user-management
```

**Query Parameters:**
- `search` (string, required): Search term

**Response:** Array of matching permission objects

## Modules API

### Get All Modules
```http
GET /modules
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "name": "user-management",
    "displayName": "User Management",
    "description": "Manage users, roles, and permissions",
    "isActive": true,
    "icon": "people",
    "route": "/modules/user-management",
    "category": "Core",
    "permissionType": "super_admin",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

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
  "message": "User not found"
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
const BASE_URL = 'http://localhost:3000/api/user-management';

// Login with API key
fetch(`${BASE_URL}/login`, {
  method: 'POST',
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
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
    // Get all users with JWT token
    return fetch(`${BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  })
  .then(res => res.json())
  .then(users => console.log(users));

// Logout
fetch(`${BASE_URL}/logout`, {
  method: 'POST',
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: '507f1f77bcf86cd799439011'
  })
})
  .then(res => res.json())
  .then(result => console.log(result));
```

### Python
```python
import requests

API_KEY = 'your_api_key_here'
BASE_URL = 'http://localhost:3000/api/user-management'

api_headers = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
}

# Login
response = requests.post(f'{BASE_URL}/login', headers=api_headers, json={
    'email': 'user@example.com',
    'password': 'password123'
})
login_data = response.json()
access_token = login_data['access_token']
print('Logged in:', login_data['user'])

# Get all users with JWT token
jwt_headers = {
    'Authorization': f'Bearer {access_token}'
}
response = requests.get(f'{BASE_URL}/users', headers=jwt_headers)
users = response.json()

# Logout
response = requests.post(f'{BASE_URL}/logout', headers=api_headers, json={
    'userId': '507f1f77bcf86cd799439011'
})
print(response.json())
```

### cURL
```bash
# Login with API key
LOGIN_RESPONSE=$(curl -X POST "http://localhost:3000/api/user-management/login" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }')

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

# Get all users with JWT token
curl -X GET "http://localhost:3000/api/user-management/users" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Logout
curl -X POST "http://localhost:3000/api/user-management/logout" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011"
  }'
```

## Support

For API support or questions, please contact the development team or refer to the in-app API documentation at `http://localhost:4200/modules/user-management` (click the 3-dot menu → API Docs).
