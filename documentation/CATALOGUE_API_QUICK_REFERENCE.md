# Catalogue API - Quick Reference

## 🔑 Create API Key

1. Go to: `http://localhost:4202/settings/api-keys`
2. Click "Create API Key"
3. Set name and expiry date
4. Copy the generated token

## 📚 View API Docs

1. Go to: `http://localhost:4202/modules/catalogue`
2. Click ⋮ (3-dot menu) in header
3. Click "API Docs"

## 🚀 Quick Start

### Get All Products
```bash
curl -H "X-API-Key: YOUR_TOKEN" \
  http://localhost:3002/api/catalogue/products
```

### Create Product
```bash
curl -X POST \
  -H "X-API-Key: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Product","productCode":"PRD001","basePrice":99.99,"currency":"USD"}' \
  http://localhost:3002/api/catalogue/products
```

### JavaScript
```javascript
fetch('http://localhost:3002/api/catalogue/products', {
  headers: { 'X-API-Key': 'YOUR_TOKEN' }
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## 📍 Base URLs

- **Development:** `http://localhost:3002/api/catalogue`
- **Production:** `http://68.178.171.103:3002/api/catalogue`

## 🔐 Authentication

**Header (Recommended):**
```
X-API-Key: your_token_here
```

**Query Parameter:**
```
?apiKey=your_token_here
```

## 📊 Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products |
| GET | `/products/:id` | Get single product |
| POST | `/products` | Create product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| GET | `/categories` | List categories |
| GET | `/collections` | List collections |
| GET | `/designers` | List designers |
| GET | `/analytics` | Get analytics |
| GET | `/export/products` | Export CSV |

## ⚠️ Error Codes

- `401` - Invalid/expired API key
- `404` - Resource not found
- `409` - Duplicate product code
- `500` - Server error

## 🧪 Test

```bash
cd tests
node test-catalogue-api-key.js
```

## 📖 Full Documentation

- **Markdown:** `/documentation/CATALOGUE_API_DOCUMENTATION.md`
- **In-App:** Catalogue module → ⋮ → API Docs
- **Implementation:** `/documentation/CATALOGUE_API_KEY_INTEGRATION.md`
