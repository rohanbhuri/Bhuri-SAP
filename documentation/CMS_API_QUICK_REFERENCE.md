# CMS API Quick Reference

## Base URL
```
http://localhost:3000/api/cms
```

## Authentication
```
X-API-Key: your_api_key_here
```

## Pages Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pages` | Get all pages |
| GET | `/pages/:id` | Get page by ID |
| GET | `/slug/:slug` | Get page by slug |
| POST | `/pages` | Create page |
| PUT | `/pages/:id` | Update page |
| DELETE | `/pages/:id` | Delete page |

## Blog Posts Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/blogs` | Get all blog posts |
| GET | `/blogs/:id` | Get blog post by ID |
| GET | `/blog/slug/:slug` | Get blog post by slug |
| POST | `/blogs` | Create blog post |
| PUT | `/blogs/:id` | Update blog post |
| DELETE | `/blogs/:id` | Delete blog post |

## Menus Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/menus` | Get all menus |
| GET | `/menus/:id` | Get menu by ID |
| GET | `/menu/location/:location` | Get menu by location |
| POST | `/menus` | Create menu |
| PUT | `/menus/:id` | Update menu |
| DELETE | `/menus/:id` | Delete menu |

## Quick Examples

### Get All Pages
```bash
curl -X GET "http://localhost:3000/api/cms/pages" \
  -H "X-API-Key: your_api_key_here"
```

### Create Page
```bash
curl -X POST "http://localhost:3000/api/cms/pages" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "About Us",
    "slug": "about-us",
    "content": "Page content here",
    "isPublished": true
  }'
```

### Get Page by Slug
```bash
curl -X GET "http://localhost:3000/api/cms/slug/about-us" \
  -H "X-API-Key: your_api_key_here"
```

### Get All Blog Posts
```bash
curl -X GET "http://localhost:3000/api/cms/blogs" \
  -H "X-API-Key: your_api_key_here"
```

### Create Blog Post
```bash
curl -X POST "http://localhost:3000/api/cms/blogs" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started",
    "slug": "getting-started",
    "content": "Blog content here",
    "author": "John Doe",
    "isPublished": true
  }'
```

### Get Menu by Location
```bash
curl -X GET "http://localhost:3000/api/cms/menu/location/header" \
  -H "X-API-Key: your_api_key_here"
```

### Create Menu
```bash
curl -X POST "http://localhost:3000/api/cms/menus" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Navigation",
    "location": "header",
    "items": [
      {"label": "Home", "url": "/", "order": 1},
      {"label": "About", "url": "/about", "order": 2}
    ],
    "isActive": true
  }'
```

## JavaScript Example
```javascript
const API_KEY = 'your_api_key_here';

// Get all pages
fetch('http://localhost:3000/api/cms/pages', {
  headers: { 'X-API-Key': API_KEY }
})
  .then(r => r.json())
  .then(data => console.log(data));

// Create page
fetch('http://localhost:3000/api/cms/pages', {
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
  .then(r => r.json())
  .then(data => console.log(data));

// Get blog posts
fetch('http://localhost:3000/api/cms/blogs', {
  headers: { 'X-API-Key': API_KEY }
})
  .then(r => r.json())
  .then(data => console.log(data));

// Get menu by location
fetch('http://localhost:3000/api/cms/menu/location/header', {
  headers: { 'X-API-Key': API_KEY }
})
  .then(r => r.json())
  .then(data => console.log(data));
```

## Python Example
```python
import requests

API_KEY = 'your_api_key_here'
BASE_URL = 'http://localhost:3000/api/cms'

headers = {'X-API-Key': API_KEY}

# Get all pages
response = requests.get(f'{BASE_URL}/pages', headers=headers)
print(response.json())

# Create page
data = {
    'title': 'Contact Us',
    'slug': 'contact-us',
    'content': 'Contact page content',
    'isPublished': True
}
response = requests.post(f'{BASE_URL}/pages', headers=headers, json=data)
print(response.json())

# Get blog posts
response = requests.get(f'{BASE_URL}/blogs', headers=headers)
print(response.json())

# Get menu by location
response = requests.get(f'{BASE_URL}/menu/location/header', headers=headers)
print(response.json())
```

## Error Codes

| Code | Message |
|------|---------|
| 401 | API key is required / Invalid API key / API key has expired |
| 404 | Page/Blog/Menu not found |
| 500 | Internal server error |

## Documentation
- Full docs: `/documentation/CMS_API_DOCUMENTATION.md`
- Test script: `/tests/test-cms-api-key.js`
