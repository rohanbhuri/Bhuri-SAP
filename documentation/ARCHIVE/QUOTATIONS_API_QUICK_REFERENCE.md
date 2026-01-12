# Quotations API Quick Reference

## Base URL
```
http://localhost:3000/api/quotations
```

## Authentication
```
X-API-Key: your_api_key_here
```

## Quotations Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all quotations |
| GET | `/:id` | Get quotation by ID |
| GET | `/client/:clientId` | Get quotations by client |
| POST | `/` | Create quotation |
| POST | `/from-enquiry/:enquiryId` | Create from enquiry |
| PUT | `/:id` | Update quotation |
| POST | `/:id/submit-approval` | Submit for approval |
| POST | `/:id/approve` | Approve quotation |
| POST | `/:id/send` | Send quotation |
| DELETE | `/:id` | Delete quotation |
| GET | `/:id/download-pdf` | Download as PDF |
| GET | `/:id/download-excel` | Download as Excel |

## Enquiries Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/enquiries/all` | Get all enquiries |
| GET | `/enquiries/:id` | Get enquiry by ID |
| POST | `/enquiries` | Create enquiry |
| PUT | `/enquiries/:id` | Update enquiry |
| DELETE | `/enquiries/:id` | Delete enquiry |

## Email Templates Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/templates/all` | Get all templates |
| POST | `/templates` | Create template |

## Presentations Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/presentations/all` | Get all presentations |
| GET | `/presentations/:id` | Get presentation by ID |
| POST | `/presentations` | Create presentation |
| PUT | `/presentations/:id` | Update presentation |
| POST | `/presentations/:id/mark-final` | Mark as final |
| POST | `/presentations/:id/send-to-client` | Send to client |
| POST | `/presentations/:id/generate` | Generate PPTX |
| POST | `/presentations/:id/convert-to-quotation` | Convert to quotation |
| POST | `/presentations/:id/link-quotation` | Link quotation |
| DELETE | `/presentations/:id` | Delete presentation |

## Quick Examples

### Get All Quotations
```bash
curl -X GET "http://localhost:3000/api/quotations/" \
  -H "X-API-Key: your_api_key_here"
```

### Create Quotation
```bash
curl -X POST "http://localhost:3000/api/quotations/" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "507f1f77bcf86cd799439012",
    "items": [{"description": "Service", "quantity": 1, "unitPrice": 1000, "total": 1000}],
    "subtotal": 1000,
    "tax": 100,
    "total": 1100
  }'
```

### Get Quotations by Client
```bash
curl -X GET "http://localhost:3000/api/quotations/client/507f1f77bcf86cd799439012" \
  -H "X-API-Key: your_api_key_here"
```

### Send Quotation
```bash
curl -X POST "http://localhost:3000/api/quotations/507f1f77bcf86cd799439011/send" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"via": "email"}'
```

### Download PDF
```bash
curl -X GET "http://localhost:3000/api/quotations/507f1f77bcf86cd799439011/download-pdf" \
  -H "X-API-Key: your_api_key_here" \
  -o quotation.pdf
```

## JavaScript Example
```javascript
const API_KEY = 'your_api_key_here';

// Get all quotations
fetch('http://localhost:3000/api/quotations/', {
  headers: { 'X-API-Key': API_KEY }
})
  .then(r => r.json())
  .then(data => console.log(data));

// Create quotation
fetch('http://localhost:3000/api/quotations/', {
  method: 'POST',
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    clientId: '507f1f77bcf86cd799439012',
    items: [{description: 'Service', quantity: 1, unitPrice: 1000, total: 1000}],
    subtotal: 1000,
    tax: 100,
    total: 1100
  })
})
  .then(r => r.json())
  .then(data => console.log(data));
```

## Python Example
```python
import requests

API_KEY = 'your_api_key_here'
BASE_URL = 'http://localhost:3000/api/quotations'

headers = {'X-API-Key': API_KEY}

# Get all quotations
response = requests.get(f'{BASE_URL}/', headers=headers)
print(response.json())

# Create quotation
data = {
    'clientId': '507f1f77bcf86cd799439012',
    'items': [{'description': 'Service', 'quantity': 1, 'unitPrice': 1000, 'total': 1000}],
    'subtotal': 1000,
    'tax': 100,
    'total': 1100
}
response = requests.post(f'{BASE_URL}/', headers=headers, json=data)
print(response.json())
```

## Error Codes

| Code | Message |
|------|---------|
| 401 | API key is required / Invalid API key / API key has expired |
| 404 | Quotation not found |
| 500 | Internal server error |

## Documentation
- Full docs: `/documentation/QUOTATIONS_API_DOCUMENTATION.md`
- Test script: `/tests/test-quotations-api-key.js`
