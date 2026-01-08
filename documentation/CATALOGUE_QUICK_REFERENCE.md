# Catalogue Module - Quick Reference

## 🚀 Quick Start

```bash
# 1. Setup
./setup-catalogue.sh

# 2. Seed Database
cd backend && node src/scripts/seed-racconti.js

# 3. Start Backend
cd backend && npm run start:dev

# 4. Start Frontend
cd frontend && npm start

# 5. Login
Email: admin@racconti.com
Password: admin123
```

## 📋 Product Table Columns

| Column | Description |
|--------|-------------|
| Image | 60x60px thumbnail |
| Product | Name + Product Code |
| Collection | Associated collection |
| Category | Product category |
| Tags | Up to 2 tags shown |
| Status | Published/Draft |
| Actions | Edit/Duplicate/Publish/Delete |

## 📝 Product Form Tabs

### 1. Basic Info
- Name, Product Code, Slug
- Short & Full Description (HTML)
- Base Price, Currency
- Category, Collection
- Tags (chip input)
- Published status

### 2. Media
- Images (upload/URL)
- Videos (upload/URL)
- 3D Models (upload/URL)

### 3. Measurements & Pricing
- Dynamic measurements
- Price modifiers per option
- Example: Size, Material, Color

### 4. SEO
- Title, Description, Keywords

## 🔧 API Endpoints

```
GET    /api/catalogue/products
GET    /api/catalogue/products/:id
POST   /api/catalogue/products
PUT    /api/catalogue/products/:id
DELETE /api/catalogue/products/:id

POST   /api/catalogue/products/upload-images
POST   /api/catalogue/products/upload-video
POST   /api/catalogue/products/upload-model
```

## 💰 Dynamic Pricing Example

```javascript
// Product Setup
basePrice: 899

measurements: [
  {
    name: "Seating",
    options: [
      { value: "2 Seater", priceModifier: 0 },
      { value: "3 Seater", priceModifier: 200 }
    ]
  },
  {
    name: "Material",
    options: [
      { value: "Fabric", priceModifier: 0 },
      { value: "Leather", priceModifier: 300 }
    ]
  }
]

// Customer Selection
3 Seater + Leather = $899 + $200 + $300 = $1,399
```

## 📦 Product Schema

```typescript
{
  name: string
  productCode: string
  slug: string
  description: string
  descriptionHtml: string
  basePrice: number
  currency: string
  images: string[]
  videos: string[]
  models3d: string[]
  categoryId: string
  collectionId: string
  tags: string[]
  isPublished: boolean
  measurements: [{
    name: string
    options: [{
      value: string
      priceModifier: number
    }]
  }]
  seo: {
    title: string
    description: string
    keywords: string
  }
}
```

## 🎯 Common Tasks

### Add Product
1. Click "Add Product"
2. Fill Basic Info
3. Upload media
4. Add measurements
5. Set SEO
6. Click "Create"

### Add Measurements
1. Go to "Measurements & Pricing" tab
2. Click "Add Measurement"
3. Enter name (e.g., "Size")
4. Click "Add Option"
5. Enter value and price modifier
6. Repeat for more options

### Upload Files
1. Go to "Media" tab
2. Click upload button
3. Select files
4. Files auto-upload
5. Preview appears

### Add Tags
1. In "Basic Info" tab
2. Type tag name
3. Press Enter or Comma
4. Tag appears as chip
5. Click X to remove

## 🐛 Troubleshooting

### Images not uploading
- Check `backend/uploads/products/images` exists
- Verify write permissions
- Check file size limits

### Product not saving
- Check all required fields
- Verify API connection
- Check browser console

### Table not showing data
- Verify backend is running
- Check API endpoint
- Seed database if empty

## 📁 File Structure

```
backend/
├── src/
│   ├── catalogue/
│   │   ├── catalogue.controller.ts
│   │   ├── catalogue.service.ts
│   │   └── catalogue.module.ts
│   ├── entities/
│   │   └── product.entity.ts
│   └── scripts/
│       └── seed-racconti.js
└── uploads/
    └── products/
        ├── images/
        ├── videos/
        └── models/

frontend/
└── src/
    └── app/
        └── modules/
            └── catalogue/
                ├── pages/
                │   └── products-page.component.ts
                └── dialogs/
                    └── product-dialog.component.ts
```

## 🔑 Key Changes from Old Version

| Old | New |
|-----|-----|
| `sku` | `productCode` |
| `price` | `basePrice` |
| `model3d` (string) | `models3d` (array) |
| `video` (string) | `videos` (array) |
| Simple form | Multi-tab form |
| No measurements | Dynamic measurements |
| No tags | Tag management |
| Basic description | HTML description |

## 📚 Documentation

- Full Guide: `documentation/CATALOGUE_PRODUCTION_READY.md`
- Changes: `documentation/CATALOGUE_CHANGES_SUMMARY.md`
- This File: `documentation/CATALOGUE_QUICK_REFERENCE.md`

## ✅ Production Checklist

- [ ] Configure cloud storage
- [ ] Set file size limits
- [ ] Add WYSIWYG editor
- [ ] Implement pagination
- [ ] Add search/filters
- [ ] Set up CDN
- [ ] Add authentication
- [ ] Implement caching
- [ ] Error handling
- [ ] Monitoring

## 🎨 UI Components Used

- Material Table
- Material Dialog
- Material Tabs
- Material Form Fields
- Material Chips
- Material Expansion Panels
- Material Icons
- Material Buttons

## 🔐 Security Notes

- Validate file types
- Limit file sizes
- Sanitize HTML input
- Add authentication guards
- Rate limit uploads
- Validate price modifiers

## 📞 Support

Issues? Check:
1. Backend logs
2. Browser console
3. MongoDB connection
4. Upload permissions
5. API endpoints

## 🚀 Next Features

- WYSIWYG editor
- Variant generator
- Inventory management
- Bulk import
- Product reviews
- Related products
