# Bhuri-SAP API Reference

**Last Updated**: 2026-01-13  
**Purpose**: Comprehensive documentation for all platform APIs.

---

## 🔐 Authentication & API Keys

All programmatic access requires an API Key.

### Auth Methods
1. **Header (Recommended)**: `X-API-Key: your_api_key`
2. **Query Parameter**: `?apiKey=your_api_key`

### Managing Keys
- **Location**: `http://localhost:4202/settings` -> **API Keys**
- **Features**: Custom names, expiry dates, and domain whitelisting.

---

## 📦 Catalogue API
**Base URL**: `http://localhost:3002/api/catalogue`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/products` | `GET` | List all products |
| `/products/:id` | `GET` | Get single product |
| `/products` | `POST` | Create a new product |
| `/products/upload-model` | `POST` | Upload 3D model (.glb) |
| `/categories` | `GET/POST` | Manage product categories |
| `/collections` | `GET/POST` | Manage product collections |
| `/analytics` | `GET` | Get catalogue statistics |

---

## 📝 CMS API
**Base URL**: `http://localhost:3000/api/cms`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/pages` | `GET/POST` | Manage website pages |
| `/slug/:slug` | `GET` | Get page by slug |
| `/blogs` | `GET/POST` | Manage blog posts |
| `/blog/slug/:slug` | `GET` | Get blog post by slug |
| `/menus` | `GET/POST` | Manage navigation menus |
| `/menu/location/:loc` | `GET` | Get menu (e.g., 'header') |

---

## 💰 Quotations API
**Base URL**: `http://localhost:3000/api/quotations`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET/POST` | Manage quotations |
| `/:id/approve` | `POST` | Approve a quotation |
| `/:id/send` | `POST` | Send quote to client |
| `/:id/download-pdf` | `GET` | Generate and download PDF |
| `/enquiries/all` | `GET` | List all customer enquiries |
| `/presentations/all` | `GET` | List product presentations |

---

## 👥 Client Management API
**Base URL**: `http://localhost:3000/api/client-management`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/requests` | `POST` | **Public**: Submit client request |
| `/contact-us` | `POST` | **Public**: Submit contact form |
| `/clients` | `GET` | List all active clients |
| `/:id/convert` | `POST` | Convert request to client account |
| `/:id/security` | `PUT` | Update client security settings |

---

## 🚀 Error Responses
- **401 Unauthorized**: Missing or invalid API key.
- **404 Not Found**: Resource doesn't exist.
- **409 Conflict**: Duplicate record (e.g., slug or product code).
- **500 Internal Error**: Server-side failure.

---

## 💻 Integration Example (Node.js)
```javascript
const API_KEY = 'your_key_here';
const BASE_URL = 'http://localhost:3000/api/cms';

fetch(`${BASE_URL}/pages`, {
  headers: { 'X-API-Key': API_KEY }
})
.then(res => res.json())
.then(data => console.log(data));
```
