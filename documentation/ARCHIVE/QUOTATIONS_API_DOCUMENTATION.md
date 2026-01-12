# Quotations Management API Documentation

## Overview

The Quotations Management API provides RESTful endpoints for managing quotations, enquiries, email templates, and presentations. All endpoints require API key authentication.

## Base URL

```
http://localhost:3000/api/quotations
```

For production:
```
http://13.126.228.247:3000/api/quotations
```

## Authentication

All API requests require an API key. You can include it in two ways:

### Header (Recommended)
```
X-API-Key: your_api_key_here
```

### Query Parameter
```
?apiKey=your_api_key_here
```

## Managing API Keys

1. Navigate to `http://localhost:4200/settings`
2. Click on "API Keys" under Privacy & Security section
3. Create a new API key with:
   - Name: Descriptive name for your integration
   - Expiry Date: When the key should expire
   - Allowed Domains: (Optional) Restrict usage to specific domains

## Quotations API

### Get All Quotations
```http
GET /
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "quotationNumber": "QT-2024-001",
    "clientId": "507f1f77bcf86cd799439012",
    "enquiryId": "507f1f77bcf86cd799439013",
    "items": [
      {
        "description": "Product/Service",
        "quantity": 1,
        "unitPrice": 1000,
        "total": 1000
      }
    ],
    "subtotal": 1000,
    "tax": 100,
    "total": 1100,
    "status": "draft",
    "validUntil": "2024-02-15T00:00:00Z",
    "notes": "Special terms and conditions",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Quotation by ID
```http
GET /:id
```

**Parameters:**
- `id` (string, required): Quotation ID

**Response:** Single quotation object

### Get Quotations by Client
```http
GET /client/:clientId
```

**Parameters:**
- `clientId` (string, required): Client ID

**Response:** Array of quotations for the client

### Create Quotation
```http
POST /
```

**Request Body:**
```json
{
  "clientId": "507f1f77bcf86cd799439012",
  "enquiryId": "507f1f77bcf86cd799439013",
  "items": [
    {
      "description": "Product/Service",
      "quantity": 1,
      "unitPrice": 1000,
      "total": 1000
    }
  ],
  "subtotal": 1000,
  "tax": 100,
  "total": 1100,
  "validUntil": "2024-02-15T00:00:00Z",
  "notes": "Special terms and conditions"
}
```

**Response:** Created quotation object

### Create Quotation from Enquiry
```http
POST /from-enquiry/:enquiryId
```

**Parameters:**
- `enquiryId` (string, required): Enquiry ID to convert

**Response:** Created quotation object

### Update Quotation
```http
PUT /:id
```

**Parameters:**
- `id` (string, required): Quotation ID

**Request Body:** Partial quotation object with fields to update

**Response:** Updated quotation object

### Submit Quotation for Approval
```http
POST /:id/submit-approval
```

**Parameters:**
- `id` (string, required): Quotation ID

**Response:**
```json
{
  "message": "Quotation submitted for approval",
  "status": "pending-approval"
}
```

### Approve Quotation
```http
POST /:id/approve
```

**Parameters:**
- `id` (string, required): Quotation ID

**Response:**
```json
{
  "message": "Quotation approved",
  "status": "approved"
}
```

### Send Quotation
```http
POST /:id/send
```

**Parameters:**
- `id` (string, required): Quotation ID

**Request Body:**
```json
{
  "via": "email"
}
```

**Response:**
```json
{
  "message": "Quotation sent successfully",
  "sentAt": "2024-01-15T10:30:00Z"
}
```

### Delete Quotation
```http
DELETE /:id
```

**Parameters:**
- `id` (string, required): Quotation ID

**Response:**
```json
{
  "message": "Quotation deleted successfully"
}
```

### Download Quotation PDF
```http
GET /:id/download-pdf
```

**Parameters:**
- `id` (string, required): Quotation ID

**Response:** PDF file download

### Download Quotation Excel
```http
GET /:id/download-excel
```

**Parameters:**
- `id` (string, required): Quotation ID

**Response:** Excel file download

## Enquiries API

### Get All Enquiries
```http
GET /enquiries/all
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "enquiryNumber": "ENQ-2024-001",
    "clientId": "507f1f77bcf86cd799439012",
    "subject": "Product Inquiry",
    "description": "Detailed inquiry description",
    "status": "open",
    "priority": "high",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Enquiry by ID
```http
GET /enquiries/:id
```

**Parameters:**
- `id` (string, required): Enquiry ID

**Response:** Single enquiry object

### Create Enquiry
```http
POST /enquiries
```

**Request Body:**
```json
{
  "clientId": "507f1f77bcf86cd799439012",
  "subject": "Product Inquiry",
  "description": "Detailed inquiry description",
  "priority": "high"
}
```

**Response:** Created enquiry object

### Update Enquiry
```http
PUT /enquiries/:id
```

**Parameters:**
- `id` (string, required): Enquiry ID

**Request Body:** Partial enquiry object with fields to update

**Response:** Updated enquiry object

### Delete Enquiry
```http
DELETE /enquiries/:id
```

**Parameters:**
- `id` (string, required): Enquiry ID

**Response:**
```json
{
  "message": "Enquiry deleted successfully"
}
```

## Email Templates API

### Get All Templates
```http
GET /templates/all
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Quotation Template",
    "subject": "Your Quotation - {{quotationNumber}}",
    "body": "Dear {{clientName}}, ...",
    "variables": ["quotationNumber", "clientName"],
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### Create Email Template
```http
POST /templates
```

**Request Body:**
```json
{
  "name": "Quotation Template",
  "subject": "Your Quotation - {{quotationNumber}}",
  "body": "Dear {{clientName}}, ...",
  "variables": ["quotationNumber", "clientName"]
}
```

**Response:** Created template object

## Presentations API

### Get All Presentations
```http
GET /presentations/all
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "title": "Product Presentation",
    "quotationId": "507f1f77bcf86cd799439011",
    "slides": [
      {
        "title": "Slide 1",
        "content": "Content here"
      }
    ],
    "status": "draft",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Presentation by ID
```http
GET /presentations/:id
```

**Parameters:**
- `id` (string, required): Presentation ID

**Response:** Single presentation object

### Create Presentation
```http
POST /presentations
```

**Request Body:**
```json
{
  "title": "Product Presentation",
  "quotationId": "507f1f77bcf86cd799439011",
  "slides": [
    {
      "title": "Slide 1",
      "content": "Content here"
    }
  ]
}
```

**Response:** Created presentation object

### Update Presentation
```http
PUT /presentations/:id
```

**Parameters:**
- `id` (string, required): Presentation ID

**Request Body:** Partial presentation object with fields to update

**Response:** Updated presentation object

### Mark Presentation as Final
```http
POST /presentations/:id/mark-final
```

**Parameters:**
- `id` (string, required): Presentation ID

**Response:**
```json
{
  "message": "Presentation marked as final",
  "status": "final"
}
```

### Send Presentation to Client
```http
POST /presentations/:id/send-to-client
```

**Parameters:**
- `id` (string, required): Presentation ID

**Response:**
```json
{
  "message": "Presentation sent to client",
  "sentAt": "2024-01-15T10:30:00Z"
}
```

### Generate Presentation (PPTX)
```http
POST /presentations/:id/generate
```

**Parameters:**
- `id` (string, required): Presentation ID

**Response:** PPTX file download

### Convert Presentation to Quotation
```http
POST /presentations/:id/convert-to-quotation
```

**Parameters:**
- `id` (string, required): Presentation ID

**Response:** Created quotation object

### Link Quotation to Presentation
```http
POST /presentations/:id/link-quotation
```

**Parameters:**
- `id` (string, required): Presentation ID

**Request Body:**
```json
{
  "quotationId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "message": "Quotation linked to presentation"
}
```

### Delete Presentation
```http
DELETE /presentations/:id
```

**Parameters:**
- `id` (string, required): Presentation ID

**Response:**
```json
{
  "message": "Presentation deleted successfully"
}
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
  "message": "API key has expired"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Quotation not found"
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
const BASE_URL = 'http://localhost:3000/api/quotations';

// Get all quotations
fetch(`${BASE_URL}/`, {
  headers: {
    'X-API-Key': API_KEY
  }
})
  .then(res => res.json())
  .then(quotations => console.log(quotations));

// Create a quotation
fetch(`${BASE_URL}/`, {
  method: 'POST',
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    clientId: '507f1f77bcf86cd799439012',
    items: [
      {
        description: 'Service',
        quantity: 1,
        unitPrice: 1000,
        total: 1000
      }
    ],
    subtotal: 1000,
    tax: 100,
    total: 1100
  })
})
  .then(res => res.json())
  .then(quotation => console.log(quotation));
```

### Python
```python
import requests

API_KEY = 'your_api_key_here'
BASE_URL = 'http://localhost:3000/api/quotations'

headers = {
    'X-API-Key': API_KEY
}

# Get all quotations
response = requests.get(f'{BASE_URL}/', headers=headers)
quotations = response.json()

# Create a quotation
data = {
    'clientId': '507f1f77bcf86cd799439012',
    'items': [
        {
            'description': 'Service',
            'quantity': 1,
            'unitPrice': 1000,
            'total': 1000
        }
    ],
    'subtotal': 1000,
    'tax': 100,
    'total': 1100
}
response = requests.post(f'{BASE_URL}/', headers=headers, json=data)
quotation = response.json()
```

### cURL
```bash
# Get all quotations
curl -X GET "http://localhost:3000/api/quotations/" \
  -H "X-API-Key: your_api_key_here"

# Create a quotation
curl -X POST "http://localhost:3000/api/quotations/" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "507f1f77bcf86cd799439012",
    "items": [
      {
        "description": "Service",
        "quantity": 1,
        "unitPrice": 1000,
        "total": 1000
      }
    ],
    "subtotal": 1000,
    "tax": 100,
    "total": 1100
  }'
```

## Support

For API support or questions, please contact the development team or refer to the in-app API documentation at `http://localhost:4200/modules/quotations` (click the 3-dot menu → API Docs).
