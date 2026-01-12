# Client Management API Documentation

## Overview
The Client Management API provides endpoints for managing client requests, client accounts, and contact messages from external websites.

## Base URL
```
http://localhost:3000/api/client-management
```

## Authentication
Most endpoints require JWT authentication. The public endpoint for contact message submission does not require authentication.

---

## Client Request Endpoints

### 1. Create Client Request (Public)
**POST** `/requests`

Submit a new client request from an external website.

**Authentication:** Not required

**Request Body:**
```json
{
  "companyName": "Acme Corp",
  "contactPerson": "John Doe",
  "email": "john@acme.com",
  "phone": "+1-555-0123",
  "website": "https://acme.com",
  "industry": "Technology",
  "companySize": "50-100",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "message": "Interested in your services"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "companyName": "Acme Corp",
  "contactPerson": "John Doe",
  "email": "john@acme.com",
  "phone": "+1-555-0123",
  "website": "https://acme.com",
  "industry": "Technology",
  "companySize": "50-100",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "message": "Interested in your services",
  "status": "pending",
  "createdAt": "2024-01-12T07:08:42.943Z"
}
```

---

### 2. Get All Client Requests
**GET** `/requests`

Retrieve all client requests.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "companyName": "Acme Corp",
    "contactPerson": "John Doe",
    "email": "john@acme.com",
    "status": "pending",
    "createdAt": "2024-01-12T07:08:42.943Z"
  }
]
```

---

### 3. Get Client Request by ID
**GET** `/requests/:requestId`

Retrieve a specific client request.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Path Parameters:**
- `requestId` (required): The request ID

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "companyName": "Acme Corp",
  "contactPerson": "John Doe",
  "email": "john@acme.com",
  "phone": "+1-555-0123",
  "website": "https://acme.com",
  "industry": "Technology",
  "companySize": "50-100",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "message": "Interested in your services",
  "status": "pending",
  "createdAt": "2024-01-12T07:08:42.943Z"
}
```

---

### 4. Update Client Request
**PUT** `/requests/:requestId`

Update a client request.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Path Parameters:**
- `requestId` (required): The request ID

**Request Body:**
```json
{
  "status": "reviewed",
  "notes": "Reviewed and approved"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "companyName": "Acme Corp",
  "status": "reviewed",
  "reviewedBy": "507f1f77bcf86cd799439012",
  "reviewedAt": "2024-01-12T08:00:00.000Z"
}
```

---

### 5. Convert Request to Client
**POST** `/requests/:requestId/convert`

Convert a client request into an active client account.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Path Parameters:**
- `requestId` (required): The request ID

**Request Body:**
```json
{
  "companyName": "Acme Corp",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@acme.com",
  "password": "SecurePass123!",
  "phone": "+1-555-0123",
  "website": "https://acme.com",
  "industry": "Technology",
  "companySize": "50-100",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "taxId": "12-3456789",
  "billingAddress": "123 Main St, New York, USA",
  "notes": "Premium client",
  "maxDevices": 5,
  "sessionTimeout": 3600,
  "requireTwoFactor": false,
  "forcePasswordChange": true,
  "restrictToBusinessHours": false,
  "allowApiAccess": false
}
```

**Response (201 Created):**
```json
{
  "client": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439014",
    "organizationId": "507f1f77bcf86cd799439015",
    "companyName": "Acme Corp",
    "email": "john@acme.com",
    "isActive": true
  },
  "user": {
    "_id": "507f1f77bcf86cd799439014",
    "email": "john@acme.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "organization": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Acme Corp",
    "code": "acme-corp"
  },
  "credentials": {
    "email": "john@acme.com",
    "password": "SecurePass123!"
  }
}
```

---

## Client Endpoints

### 6. Get All Clients
**GET** `/clients`

Retrieve all clients.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "companyName": "Acme Corp",
    "email": "john@acme.com",
    "isActive": true,
    "createdAt": "2024-01-12T07:08:42.943Z"
  }
]
```

---

### 7. Get Client by ID
**GET** `/clients/:clientId`

Retrieve a specific client.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Path Parameters:**
- `clientId` (required): The client ID

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439014",
  "organizationId": "507f1f77bcf86cd799439015",
  "companyName": "Acme Corp",
  "contactPerson": "John Doe",
  "email": "john@acme.com",
  "phone": "+1-555-0123",
  "website": "https://acme.com",
  "industry": "Technology",
  "isActive": true
}
```

---

### 8. Update Client
**PUT** `/clients/:clientId`

Update client information.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Path Parameters:**
- `clientId` (required): The client ID

**Request Body:**
```json
{
  "companyName": "Acme Corp Updated",
  "phone": "+1-555-0124",
  "website": "https://acme-updated.com"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "companyName": "Acme Corp Updated",
  "phone": "+1-555-0124",
  "website": "https://acme-updated.com"
}
```

---

### 9. Delete Client
**DELETE** `/clients/:clientId`

Delete a client.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin only

**Path Parameters:**
- `clientId` (required): The client ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Client deleted successfully"
}
```

---

### 10. Toggle Client Status
**PUT** `/clients/:clientId/status`

Activate or deactivate a client.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Path Parameters:**
- `clientId` (required): The client ID

**Request Body:**
```json
{
  "isActive": false
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "isActive": false
}
```

---

### 11. Request Login Credentials
**POST** `/clients/:clientId/request-credentials`

Generate new login credentials for a client.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Path Parameters:**
- `clientId` (required): The client ID

**Request Body:**
```json
{
  "email": "john@acme.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login credentials created successfully",
  "credentials": {
    "email": "john@acme.com",
    "password": "GeneratedPass123!",
    "userId": "507f1f77bcf86cd799439014"
  }
}
```

---

### 12. Get Client Security Settings
**GET** `/clients/:clientId/security-settings`

Retrieve security settings for a client.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Path Parameters:**
- `clientId` (required): The client ID

**Response (200 OK):**
```json
{
  "requireTwoFactor": false,
  "sessionTimeout": 3600,
  "restrictToBusinessHours": false,
  "allowApiAccess": false,
  "expiryDate": null,
  "ipWhitelist": null,
  "maxDevices": 5
}
```

---

### 13. Update Client Security Settings
**PUT** `/clients/:clientId/security-settings`

Update security settings for a client.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Path Parameters:**
- `clientId` (required): The client ID

**Request Body:**
```json
{
  "requireTwoFactor": true,
  "sessionTimeout": 1800,
  "maxDevices": 3,
  "ipWhitelist": "192.168.1.1,192.168.1.2"
}
```

**Response (200 OK):**
```json
{
  "requireTwoFactor": true,
  "sessionTimeout": 1800,
  "maxDevices": 3,
  "ipWhitelist": "192.168.1.1,192.168.1.2"
}
```

---

## Contact Us Endpoints

### 14. Create Contact Message (Public)
**POST** `/contact-us`

Submit a contact message from an external website.

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Product Inquiry",
  "message": "I would like to know more about your products"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Product Inquiry",
  "message": "I would like to know more about your products",
  "isRead": false,
  "createdAt": "2024-01-12T07:08:42.943Z"
}
```

---

### 15. Get All Contact Messages
**GET** `/contact-us`

Retrieve all contact messages.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "Product Inquiry",
    "message": "I would like to know more about your products",
    "isRead": false,
    "createdAt": "2024-01-12T07:08:42.943Z"
  }
]
```

---

### 16. Get Unread Contact Message Count
**GET** `/contact-us/unread-count`

Get the count of unread contact messages.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Response (200 OK):**
```json
{
  "count": 3
}
```

---

### 17. Get Contact Message by ID
**GET** `/contact-us/:messageId`

Retrieve a specific contact message.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Path Parameters:**
- `messageId` (required): The message ID

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Product Inquiry",
  "message": "I would like to know more about your products",
  "isRead": false,
  "createdAt": "2024-01-12T07:08:42.943Z"
}
```

---

### 18. Mark Contact Message as Read
**PUT** `/contact-us/:messageId/read`

Mark a contact message as read.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Path Parameters:**
- `messageId` (required): The message ID

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Product Inquiry",
  "message": "I would like to know more about your products",
  "isRead": true,
  "createdAt": "2024-01-12T07:08:42.943Z"
}
```

---

### 19. Delete Contact Message
**DELETE** `/contact-us/:messageId`

Delete a contact message.

**Authentication:** Required (JWT Token)
**Authorization:** Super Admin, Admin

**Path Parameters:**
- `messageId` (required): The message ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

## Authentication Endpoints

### 20. API Login
**POST** `/login`

Login via API using email and password.

**Authentication:** API Key required

**Request Body:**
```json
{
  "email": "john@acme.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439014",
    "email": "john@acme.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "client": {
    "id": "507f1f77bcf86cd799439013",
    "companyName": "Acme Corp",
    "email": "john@acme.com"
  },
  "roles": [
    {
      "id": "507f1f77bcf86cd799439016",
      "name": "Client",
      "type": "client"
    }
  ]
}
```

---

### 21. API Logout
**POST** `/logout`

Logout from API session.

**Authentication:** API Key required

**Request Body:**
```json
{
  "clientId": "507f1f77bcf86cd799439013"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid request data",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Resource already exists",
  "error": "Conflict"
}
```

---

## Integration Examples

### JavaScript/Node.js
```javascript
// Create contact message
async function submitContactForm(data) {
  const response = await fetch('http://localhost:3000/api/client-management/contact-us', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Get contact messages (requires auth)
async function getContactMessages(token) {
  const response = await fetch('http://localhost:3000/api/client-management/contact-us', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

### cURL
```bash
# Create contact message
curl -X POST http://localhost:3000/api/client-management/contact-us \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "Product Inquiry",
    "message": "I would like to know more about your products"
  }'

# Get contact messages
curl -X GET http://localhost:3000/api/client-management/contact-us \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Permissions Required

| Endpoint | Permission | Role |
|----------|-----------|------|
| POST /requests | Public | None |
| GET /requests | client-management:read:organization | Admin, Super Admin |
| POST /contact-us | Public | None |
| GET /contact-us | client-management:read:contact-us | Admin, Super Admin, Manager |
| PUT /contact-us/:id/read | client-management:update:contact-us | Admin, Super Admin, Manager |
| DELETE /contact-us/:id | client-management:delete:contact-us | Admin, Super Admin, Manager |

