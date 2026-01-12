# Contact Us API Documentation

## Overview
The Contact Us API allows external websites to submit contact messages that are stored and managed within the Client Management module. Messages include name, email, subject, and message content.

## Base URL
```
http://localhost:3000/api/contact-us
```

## Endpoints

### 1. Create Contact Message
**POST** `/contact-us`

Submit a new contact message from an external website.

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about services",
  "message": "I would like to know more about your services...",
  "organizationId": "optional-org-id"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about services",
  "message": "I would like to know more about your services...",
  "organizationId": null,
  "isRead": false,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/contact-us \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Inquiry about services",
    "message": "I would like to know more about your services..."
  }'
```

---

### 2. Get All Contact Messages
**GET** `/contact-us`

Retrieve all contact messages. Requires authentication and admin/super-admin role.

**Authentication:** Required (JWT Token)

**Query Parameters:**
- `organizationId` (optional): Filter messages by organization

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Inquiry about services",
    "message": "I would like to know more about your services...",
    "organizationId": null,
    "isRead": false,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "Partnership proposal",
    "message": "We are interested in partnering with your company...",
    "organizationId": null,
    "isRead": true,
    "createdAt": "2024-01-14T15:45:00Z"
  }
]
```

**Example cURL:**
```bash
curl -X GET http://localhost:3000/api/contact-us \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 3. Get Unread Message Count
**GET** `/contact-us/unread-count`

Get the count of unread contact messages.

**Authentication:** Required (JWT Token)

**Query Parameters:**
- `organizationId` (optional): Filter by organization

**Response (200 OK):**
```json
{
  "count": 3
}
```

**Example cURL:**
```bash
curl -X GET http://localhost:3000/api/contact-us/unread-count \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 4. Get Single Message
**GET** `/contact-us/:messageId`

Retrieve a specific contact message by ID.

**Authentication:** Required (JWT Token)

**Path Parameters:**
- `messageId` (required): The message ID

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about services",
  "message": "I would like to know more about your services...",
  "organizationId": null,
  "isRead": false,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Example cURL:**
```bash
curl -X GET http://localhost:3000/api/contact-us/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 5. Mark Message as Read
**PUT** `/contact-us/:messageId/read`

Mark a contact message as read.

**Authentication:** Required (JWT Token)

**Path Parameters:**
- `messageId` (required): The message ID

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about services",
  "message": "I would like to know more about your services...",
  "organizationId": null,
  "isRead": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Example cURL:**
```bash
curl -X PUT http://localhost:3000/api/contact-us/507f1f77bcf86cd799439011/read \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 6. Delete Message
**DELETE** `/contact-us/:messageId`

Delete a contact message.

**Authentication:** Required (JWT Token)

**Path Parameters:**
- `messageId` (required): The message ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

**Example cURL:**
```bash
curl -X DELETE http://localhost:3000/api/contact-us/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Error Responses

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Message not found"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

---

## Integration Example

### JavaScript/Node.js
```javascript
// Create a contact message
async function submitContactForm(data) {
  const response = await fetch('http://localhost:3000/api/contact-us', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message
    })
  });
  
  return response.json();
}

// Get all messages (requires auth)
async function getMessages(token) {
  const response = await fetch('http://localhost:3000/api/contact-us', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
}
```

### Python
```python
import requests

# Create a contact message
def submit_contact_form(name, email, subject, message):
    url = 'http://localhost:3000/api/contact-us'
    data = {
        'name': name,
        'email': email,
        'subject': subject,
        'message': message
    }
    response = requests.post(url, json=data)
    return response.json()

# Get all messages
def get_messages(token):
    url = 'http://localhost:3000/api/contact-us'
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(url, headers=headers)
    return response.json()
```

---

## Notes

- The POST endpoint (create message) does **not** require authentication, allowing external websites to submit messages
- All other endpoints require JWT authentication and admin/super-admin role
- Messages are stored with a timestamp and read status
- Organization ID is optional and can be used to filter messages by organization
- Unread count is useful for displaying notification badges in the UI
