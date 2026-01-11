# CMS Management API Documentation

## Overview

The CMS Management API provides RESTful endpoints for managing pages, blog posts, and menus. All endpoints require API key authentication.

## Base URL

```
http://localhost:3000/api/cms
```

For production:
```
http://13.126.228.247:3000/api/cms
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

## Pages API

### Get All Pages
```http
GET /pages
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "About Us",
    "slug": "about-us",
    "content": "Page content here",
    "metaTitle": "About Us - Company",
    "metaDescription": "Learn more about our company",
    "metaKeywords": "about, company, team",
    "isPublished": true,
    "publishedAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Page by ID
```http
GET /pages/:id
```

**Parameters:**
- `id` (string, required): Page ID

**Response:** Single page object

### Get Page by Slug
```http
GET /slug/:slug
```

**Parameters:**
- `slug` (string, required): Page slug

**Response:** Single page object

### Create Page
```http
POST /pages
```

**Request Body:**
```json
{
  "title": "About Us",
  "slug": "about-us",
  "content": "Page content here",
  "metaTitle": "About Us - Company",
  "metaDescription": "Learn more about our company",
  "metaKeywords": "about, company, team",
  "isPublished": true
}
```

**Response:** Created page object

### Update Page
```http
PUT /pages/:id
```

**Parameters:**
- `id` (string, required): Page ID

**Request Body:** Partial page object with fields to update

**Response:** Updated page object

### Delete Page
```http
DELETE /pages/:id
```

**Parameters:**
- `id` (string, required): Page ID

**Response:**
```json
{
  "message": "Page deleted successfully"
}
```

## Blog Posts API

### Get All Blog Posts
```http
GET /blogs
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Getting Started with Our Platform",
    "slug": "getting-started-platform",
    "content": "Blog post content here",
    "excerpt": "Short excerpt of the blog post",
    "author": "John Doe",
    "category": "Tutorial",
    "tags": ["getting-started", "tutorial"],
    "featuredImage": "/uploads/blog/featured-image.jpg",
    "isPublished": true,
    "publishedAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Blog Post by ID
```http
GET /blogs/:id
```

**Parameters:**
- `id` (string, required): Blog post ID

**Response:** Single blog post object

### Get Blog Post by Slug
```http
GET /blog/slug/:slug
```

**Parameters:**
- `slug` (string, required): Blog post slug

**Response:** Single blog post object

### Create Blog Post
```http
POST /blogs
```

**Request Body:**
```json
{
  "title": "Getting Started with Our Platform",
  "slug": "getting-started-platform",
  "content": "Blog post content here",
  "excerpt": "Short excerpt of the blog post",
  "author": "John Doe",
  "category": "Tutorial",
  "tags": ["getting-started", "tutorial"],
  "featuredImage": "/uploads/blog/featured-image.jpg",
  "isPublished": true
}
```

**Response:** Created blog post object

### Update Blog Post
```http
PUT /blogs/:id
```

**Parameters:**
- `id` (string, required): Blog post ID

**Request Body:** Partial blog post object with fields to update

**Response:** Updated blog post object

### Delete Blog Post
```http
DELETE /blogs/:id
```

**Parameters:**
- `id` (string, required): Blog post ID

**Response:**
```json
{
  "message": "Blog post deleted successfully"
}
```

## Menus API

### Get All Menus
```http
GET /menus
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Main Navigation",
    "location": "header",
    "items": [
      {
        "label": "Home",
        "url": "/",
        "order": 1,
        "children": []
      },
      {
        "label": "About",
        "url": "/about",
        "order": 2,
        "children": []
      }
    ],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Menu by ID
```http
GET /menus/:id
```

**Parameters:**
- `id` (string, required): Menu ID

**Response:** Single menu object

### Get Menu by Location
```http
GET /menu/location/:location
```

**Parameters:**
- `location` (string, required): Menu location (e.g., "header", "footer")

**Response:** Single menu object

### Create Menu
```http
POST /menus
```

**Request Body:**
```json
{
  "name": "Main Navigation",
  "location": "header",
  "items": [
    {
      "label": "Home",
      "url": "/",
      "order": 1,
      "children": []
    },
    {
      "label": "About",
      "url": "/about",
      "order": 2,
      "children": []
    }
  ],
  "isActive": true
}
```

**Response:** Created menu object

### Update Menu
```http
PUT /menus/:id
```

**Parameters:**
- `id` (string, required): Menu ID

**Request Body:** Partial menu object with fields to update

**Response:** Updated menu object

### Delete Menu
```http
DELETE /menus/:id
```

**Parameters:**
- `id` (string, required): Menu ID

**Response:**
```json
{
  "message": "Menu deleted successfully"
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
  "message": "Page not found"
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
const BASE_URL = 'http://localhost:3000/api/cms';

// Get all pages
fetch(`${BASE_URL}/pages`, {
  headers: {
    'X-API-Key': API_KEY
  }
})
  .then(res => res.json())
  .then(pages => console.log(pages));

// Create a page
fetch(`${BASE_URL}/pages`, {
  method: 'POST',
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Contact Us',
    slug: 'contact-us',
    content: 'Contact page content',
    isPublished: true
  })
})
  .then(res => res.json())
  .then(page => console.log(page));

// Get blog posts
fetch(`${BASE_URL}/blogs`, {
  headers: {
    'X-API-Key': API_KEY
  }
})
  .then(res => res.json())
  .then(blogs => console.log(blogs));

// Get menu by location
fetch(`${BASE_URL}/menu/location/header`, {
  headers: {
    'X-API-Key': API_KEY
  }
})
  .then(res => res.json())
  .then(menu => console.log(menu));
```

### Python
```python
import requests

API_KEY = 'your_api_key_here'
BASE_URL = 'http://localhost:3000/api/cms'

headers = {
    'X-API-Key': API_KEY
}

# Get all pages
response = requests.get(f'{BASE_URL}/pages', headers=headers)
pages = response.json()

# Create a page
data = {
    'title': 'Contact Us',
    'slug': 'contact-us',
    'content': 'Contact page content',
    'isPublished': True
}
response = requests.post(f'{BASE_URL}/pages', headers=headers, json=data)
page = response.json()

# Get blog posts
response = requests.get(f'{BASE_URL}/blogs', headers=headers)
blogs = response.json()

# Get menu by location
response = requests.get(f'{BASE_URL}/menu/location/header', headers=headers)
menu = response.json()
```

### cURL
```bash
# Get all pages
curl -X GET "http://localhost:3000/api/cms/pages" \
  -H "X-API-Key: your_api_key_here"

# Create a page
curl -X POST "http://localhost:3000/api/cms/pages" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Contact Us",
    "slug": "contact-us",
    "content": "Contact page content",
    "isPublished": true
  }'

# Get blog posts
curl -X GET "http://localhost:3000/api/cms/blogs" \
  -H "X-API-Key: your_api_key_here"

# Get menu by location
curl -X GET "http://localhost:3000/api/cms/menu/location/header" \
  -H "X-API-Key: your_api_key_here"
```

## Support

For API support or questions, please contact the development team or refer to the in-app API documentation at `http://localhost:4200/modules/cms` (click the 3-dot menu → API Docs).
