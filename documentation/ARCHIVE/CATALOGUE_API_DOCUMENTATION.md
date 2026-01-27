# Catalogue Management API Documentation

## Overview

The Catalogue Management API provides RESTful endpoints for managing products, categories, collections, and designers. All endpoints require API key authentication.

## Base URL

```
http://localhost:3002/api/catalogue
```

For production:
```
http://68.178.171.103:3002/api/catalogue
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

1. Navigate to `http://localhost:4202/settings`
2. Click on "API Keys" under Privacy & Security section
3. Create a new API key with:
   - Name: Descriptive name for your integration
   - Expiry Date: When the key should expire
   - Allowed Domains: (Optional) Restrict usage to specific domains

## Products API

### Get All Products
```http
GET /products
```

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Records per page (default: 10)
- `search` (string, optional): Search by name or product code
- `categoryId` (string, optional): Filter by category ID
- `collectionId` (string, optional): Filter by collection ID

**Response:**
```json
{
  "items": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Modern Sofa",
      "productCode": "SOF001",
      "slug": "modern-sofa",
      "description": "A comfortable modern sofa",
      "basePrice": 1299.99,
      "currency": "USD",
      "categoryId": "507f1f77bcf86cd799439012",
      "collectionId": "507f1f77bcf86cd799439013",
      "designerId": "507f1f77bcf86cd799439014",
      "tags": ["furniture", "living-room"],
      "isPublished": true,
      "featuredImage": "/uploads/products/images/sofa-main.jpg",
      "imageGallery": ["/uploads/products/images/sofa-1.jpg"],
      "videos": ["/uploads/products/videos/sofa-demo.mp4"],
      "models3d": ["/uploads/products/models/sofa.glb"],
      "variations": [...],
      "dimensionConfig": {...},
      "seo": {...},
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 150
}
```
*Note: For backward compatibility, if no query parameters are provided, the API returns the direct array of products without the wrapper object.*

### Get Single Product
```http
GET /products/:id
```

**Parameters:**
- `id` (string, required): Product ID

**Response:** Single product object (same structure as above)

### Check Product Code
```http
GET /products/check-code/:code?excludeId=<id>
```

**Parameters:**
- `code` (string, required): Product code to check
- `excludeId` (string, optional): Product ID to exclude from check

**Response:**
```json
{
  "exists": false
}
```

### Create Product
```http
POST /products
```

**Request Body:**
```json
{
  "name": "Modern Sofa",
  "productCode": "SOF001",
  "slug": "modern-sofa",
  "description": "A comfortable modern sofa",
  "basePrice": 1299.99,
  "currency": "USD",
  "categoryId": "507f1f77bcf86cd799439012",
  "collectionId": "507f1f77bcf86cd799439013",
  "designerId": "507f1f77bcf86cd799439014",
  "tags": ["furniture", "living-room"],
  "isPublished": true,
  "featuredImage": "/uploads/products/images/sofa-main.jpg",
  "imageGallery": ["/uploads/products/images/sofa-1.jpg"],
  "dimensionConfig": {
    "shape": "rectangle",
    "unit": "cm",
    "width": { "min": 180, "max": 220, "default": 200 },
    "height": 85,
    "depth": 90
  }
}
```

**Response:** Created product object

### Update Product
```http
PUT /products/:id
```

**Parameters:**
- `id` (string, required): Product ID

**Request Body:** Partial product object with fields to update

**Response:** Updated product object

### Delete Product
```http
DELETE /products/:id
```

**Parameters:**
- `id` (string, required): Product ID

**Response:** 
```json
{
  "message": "Product deleted successfully"
}
```

### Upload Product Images
```http
POST /products/upload-images
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `images` (file[], max 10): Image files

**Response:**
```json
{
  "urls": [
    "/uploads/products/images/1234567890-image1.jpg",
    "/uploads/products/images/1234567891-image2.jpg"
  ]
}
```

### Upload Product Video
```http
POST /products/upload-video
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `video` (file): Video file

**Response:**
```json
{
  "url": "/uploads/products/videos/1234567890-video.mp4"
}
```

### Upload 3D Model
```http
POST /products/upload-model
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `model` (file): 3D model file (.glb, .gltf)

**Response:**
```json
{
  "url": "/uploads/products/models/1234567890-model.glb"
}
```

## Categories API

### Get All Categories
```http
GET /categories
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Living Room",
    "slug": "living-room",
    "description": "Furniture for living rooms",
    "image": "/uploads/categories/living-room.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Single Category
```http
GET /categories/:id
```

### Create Category
```http
POST /categories
```

**Request Body:**
```json
{
  "name": "Living Room",
  "slug": "living-room",
  "description": "Furniture for living rooms",
  "image": "/uploads/categories/living-room.jpg",
  "isActive": true
}
```

### Update Category
```http
PUT /categories/:id
```

### Delete Category
```http
DELETE /categories/:id
```

### Upload Category Image
```http
POST /categories/upload-image
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `image` (file): Image file

## Collections API

### Get All Collections
```http
GET /collections
```

### Get Single Collection
```http
GET /collections/:id
```

### Create Collection
```http
POST /collections
```

### Update Collection
```http
PUT /collections/:id
```

### Delete Collection
```http
DELETE /collections/:id
```

### Upload Collection Image
```http
POST /collections/upload-image
```

## Designers API

### Get All Designers
```http
GET /designers
```

### Get Single Designer
```http
GET /designers/:id
```

### Create Designer
```http
POST /designers
```

### Update Designer
```http
PUT /designers/:id
```

### Delete Designer
```http
DELETE /designers/:id
```

### Upload Designer Profile
```http
POST /designers/upload-profile
```

### Upload Designer Portfolio
```http
POST /designers/upload-portfolio
```

## Analytics API

### Get Analytics
```http
GET /analytics
```

**Response:**
```json
{
  "totalProducts": 150,
  "publishedProducts": 120,
  "totalCategories": 12,
  "activeCategories": 10,
  "totalCollections": 8,
  "activeCollections": 7,
  "totalDesigners": 5,
  "activeDesigners": 4,
  "totalVariations": 450,
  "avgVariationsPerProduct": "3.0",
  "productsByCategory": [
    { "id": "...", "name": "Living Room", "count": 45 }
  ],
  "productsByCollection": [
    { "id": "...", "name": "Modern Collection", "count": 30 }
  ],
  "priceRange": {
    "min": 99.99,
    "avg": "599.50",
    "max": 2999.99
  },
  "mediaAssets": {
    "images": 450,
    "videos": 75,
    "models3d": 120
  },
  "recentChanges": {
    "products": 15,
    "categories": 2,
    "collections": 1,
    "designers": 0
  }
}
```

## Export API

### Export Products CSV
```http
GET /export/products
```

**Response:** CSV file download

### Export Categories CSV
```http
GET /export/categories
```

### Export Collections CSV
```http
GET /export/collections
```

### Export All (ZIP)
```http
GET /export/all
```

**Response:** ZIP file containing all CSV exports

## Import API

### Get Product Template
```http
GET /template/products
```

**Response:** CSV template file

### Import Products
```http
POST /import/products
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (file): CSV file

**Response:**
```json
{
  "success": 45,
  "failed": 2,
  "errors": [
    "Row 3: Product code already exists",
    "Row 7: Invalid category ID"
  ]
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
  "message": "Product not found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Product code already exists"
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
const BASE_URL = 'http://localhost:3002/api/catalogue';

// Get all products
fetch(`${BASE_URL}/products`, {
  headers: {
    'X-API-Key': API_KEY
  }
})
  .then(res => res.json())
  .then(products => console.log(products));

// Create a product
fetch(`${BASE_URL}/products`, {
  method: 'POST',
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Product',
    productCode: 'PRD001',
    basePrice: 999.99,
    currency: 'INR',
    isPublished: true
  })
})
  .then(res => res.json())
  .then(product => console.log(product));
```

### Python
```python
import requests

API_KEY = 'your_api_key_here'
BASE_URL = 'http://localhost:3002/api/catalogue'

headers = {
    'X-API-Key': API_KEY
}

# Get all products
response = requests.get(f'{BASE_URL}/products', headers=headers)
products = response.json()

# Create a product
data = {
    'name': 'New Product',
    'productCode': 'PRD001',
    'basePrice': 999.99,
    'currency': 'INR',
    'isPublished': True
}
response = requests.post(f'{BASE_URL}/products', headers=headers, json=data)
product = response.json()
```

### cURL
```bash
# Get all products
curl -X GET "http://localhost:3002/api/catalogue/products" \
  -H "X-API-Key: your_api_key_here"

# Create a product
curl -X POST "http://localhost:3002/api/catalogue/products" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "productCode": "PRD001",
    "basePrice": 999.99,
    "currency": "USD",
    "isPublished": true
  }'
```

## Rate Limiting

Currently, there are no rate limits enforced. However, please be respectful of the API and avoid excessive requests.

## Support

For API support or questions, please contact the development team or refer to the in-app API documentation at `http://localhost:4202/modules/catalogue` (click the 3-dot menu → API Docs).
