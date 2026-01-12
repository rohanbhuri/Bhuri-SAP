# Catalogue Management Module - Production Ready

## Overview
The Catalogue Management module is now production-ready with comprehensive features for managing products with dynamic pricing, measurements, media uploads, and more.

## Features Implemented

### 1. Product Table Enhancements
- **Image Column**: Displays product thumbnail (60x60px)
- **Product Column**: Shows product name and product code
- **Collection Column**: Displays associated collection
- **Category Column**: Shows product category
- **Tags Column**: Displays up to 2 tags with "+X more" indicator
- **Status Column**: Published/Draft status
- **Actions Column**: Edit, Duplicate, Publish/Unpublish, Delete

### 2. Product Form - Multi-Tab Interface

#### Basic Info Tab
- **Product Name**: Required field with auto-slug generation
- **Product Code**: Unique identifier (replaces SKU)
- **Slug**: URL-friendly identifier
- **Short Description**: Brief product description
- **Full Description (HTML)**: Rich text description with HTML support
- **Base Price**: Starting price before variants
- **Currency**: USD, EUR, GBP, INR
- **Category**: Product category selection
- **Collection**: Product collection selection
- **Tags**: Dynamic tag management with chip input
- **Published Status**: Toggle product visibility

#### Media Tab
- **Images**:
  - File upload (multiple images)
  - URL input (comma-separated)
  - Preview with remove option
  
- **Videos**:
  - File upload
  - URL input (comma-separated)
  
- **3D Models**:
  - GLB/GLTF file upload
  - URL input (comma-separated)

#### Measurements & Pricing Tab
- **Dynamic Measurements**: Add unlimited measurement types
  - Examples: Size (2 Seater, 3 Seater), Material (Fabric, Leather), Color (Red, Blue)
  - Each option has a price modifier
  - Expandable accordion interface
  
- **Price Calculation**: Base price + measurement modifiers = Final price

#### SEO Tab
- **SEO Title**: Meta title for search engines
- **SEO Description**: Meta description
- **SEO Keywords**: Comma-separated keywords

## Backend Structure

### Entities

#### Product Entity (`product.entity.ts`)
```typescript
{
  _id: ObjectId
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
  measurements: Array<{
    name: string
    options: Array<{
      value: string
      priceModifier: number
    }>
  }>
  variants: Array<{
    name: string
    measurements: Record<string, string>
    price: number
    sku: string
    stock: number
  }>
  attributes: Record<string, any>
  seo: {
    title: string
    description: string
    keywords: string
  }
  createdAt: Date
  updatedAt: Date
}
```

### API Endpoints

#### Products
- `GET /api/catalogue/products` - Get all products
- `GET /api/catalogue/products/:id` - Get single product
- `POST /api/catalogue/products` - Create product
- `PUT /api/catalogue/products/:id` - Update product
- `DELETE /api/catalogue/products/:id` - Delete product

#### File Uploads
- `POST /api/catalogue/products/upload-images` - Upload multiple images
- `POST /api/catalogue/products/upload-video` - Upload video
- `POST /api/catalogue/products/upload-model` - Upload 3D model

### Upload Directories
```
backend/uploads/products/
├── images/
├── videos/
└── models/
```

## Frontend Structure

### Components

#### Products Page (`products-page.component.ts`)
- Displays product table with all columns
- Handles CRUD operations
- Opens product dialog for add/edit

#### Product Dialog (`product-dialog.component.ts`)
- Multi-tab interface
- Form validation
- File upload handling
- Dynamic measurements management
- Tag management

### Services

#### Catalogue Service (`catalogue.service.ts`)
- API communication
- CRUD operations
- File upload handling

## Usage Examples

### Adding a Product with Measurements

1. Click "Add Product" button
2. Fill in Basic Info:
   - Name: "Modern Sofa"
   - Product Code: "SOFA-001"
   - Base Price: $899
   - Category: Living Room
   - Tags: Sofa, Modern, Furniture

3. Add Media:
   - Upload product images
   - Add video URL
   - Upload 3D model (optional)

4. Configure Measurements:
   - Add "Seating" measurement:
     - 2 Seater: +$0
     - 3 Seater: +$200
     - 4 Seater: +$400
   - Add "Material" measurement:
     - Fabric: +$0
     - Leather: +$300
     - Velvet: +$250
   - Add "Color" measurement:
     - Gray: +$0
     - Blue: +$0
     - Beige: +$0

5. Set SEO:
   - Title: "Modern Sofa - Comfortable Living Room Furniture"
   - Description: "Premium modern sofa available in multiple sizes and materials"
   - Keywords: "sofa, modern furniture, living room"

6. Click "Create"

### Price Calculation Example
- Base Price: $899
- Customer selects: 3 Seater (+$200) + Leather (+$300) + Blue (+$0)
- **Final Price: $1,399**

## Database Seeding

Run the seed script to populate sample data:
```bash
cd backend
node src/scripts/seed-racconti.js
```

This creates:
- 2 sample products with measurements
- Categories and collections
- Admin user (admin@racconti.com / admin123)

## Installation & Setup

### Backend
```bash
cd backend
npm install
# Ensure uploads directories exist
mkdir -p uploads/products/images uploads/products/videos uploads/products/models
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Configuration

### Backend (.env)
```
DATABASE_URI=mongodb://localhost:27017/racconti-xrm
JWT_SECRET=your-secret-key
PORT=3000
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## Production Deployment

### File Upload Considerations
- Configure cloud storage (AWS S3, Cloudinary) for production
- Update upload endpoints to use cloud storage
- Set appropriate file size limits
- Implement image optimization

### Performance Optimization
- Implement pagination for product list
- Add search and filter functionality
- Lazy load images
- Cache product data

### Security
- Validate file types and sizes
- Sanitize HTML descriptions
- Implement rate limiting on uploads
- Add authentication guards

## Future Enhancements

1. **Variant Generator**: Auto-generate all possible combinations from measurements
2. **Inventory Management**: Track stock levels per variant
3. **Bulk Import**: CSV/Excel import for products
4. **Image Editor**: Crop, resize, and optimize images
5. **WYSIWYG Editor**: Rich text editor for descriptions (Quill, TinyMCE)
6. **Product Comparison**: Compare multiple products
7. **Related Products**: Suggest related items
8. **Product Reviews**: Customer reviews and ratings
9. **Price History**: Track price changes over time
10. **Multi-language Support**: Translate product details

## Testing

### Manual Testing Checklist
- [ ] Create product with all fields
- [ ] Upload images, videos, 3D models
- [ ] Add multiple measurements with options
- [ ] Edit existing product
- [ ] Duplicate product
- [ ] Publish/unpublish product
- [ ] Delete product
- [ ] Verify table displays all columns correctly
- [ ] Test tag management
- [ ] Verify SEO fields save correctly

## Support

For issues or questions:
- Check backend logs: `backend/logs/`
- Check browser console for frontend errors
- Verify API endpoints are accessible
- Ensure MongoDB is running
- Check file upload permissions

## License
Private - All rights reserved

## Author
Rohan Bhuri
