# Racconti XRM - Master Documentation

**Last Updated**: 2025-12-24  
**Version**: 1.0  
**Purpose**: Complete project knowledge base for AI agents to understand and complete Racconti XRM

---

## 🎯 Project Overview

**Racconti XRM** is a specialized Customer Experience (CX) management system built on the Bhuri-SAP platform. It's designed for visual-heavy, customer-facing businesses (furniture, real estate, high-end retail) requiring:
- 3D product visualization (GLB/GLTF support)
- Content management system (CMS)
- Product catalogue with collections
- Quotation management with client portal
- Premium UI/UX

**Key Differentiator**: 3D model upload/preview + full CMS for customer-facing websites

---

## 🏗️ Architecture

### Tech Stack
- **Backend**: NestJS + TypeORM + MongoDB
- **Frontend**: Angular 20+ (standalone components)
- **Database**: MongoDB (multi-tenant via organization context)
- **Node**: v22 (required)
- **3D Viewer**: `@google/model-viewer` web component
- **Styling**: Tailwind CSS + CSS Variables (theme system)

### Project Structure
```
Bhuri-SAP/
├── backend/                 # NestJS application
│   ├── src/
│   │   ├── entities/       # TypeORM entities
│   │   ├── catalogue/      # Product/Category/Collection module
│   │   ├── cms/            # Pages/Blogs/Menus module
│   │   ├── quotations/     # Quote management module
│   │   └── app.module.ts   # Root module
│   └── package.json
├── frontend/                # Angular application
│   ├── src/app/
│   │   ├── modules/
│   │   │   ├── catalogue/  # Product management
│   │   │   ├── cms/        # Content management
│   │   │   └── quotations/ # Quote management
│   │   └── brand.config.ts # Multi-brand configuration
│   └── angular.json        # Build configs per brand
├── configs/                 # Brand-specific configs
├── documentation/           # Project docs (32 files)
└── ecosystem.config.js      # PM2 process manager

```

### Multi-Tenant Architecture
- **Brands**: beax-rm, true-process, raccontixrm (focus)
- Each brand has separate:
  - Frontend port (4200, 4201, 4202)
  - Backend port (3000, 3001, 3002)
  - MongoDB database
  - Color scheme/branding

---

## 📊 Database Schemas

### Core Entities

**Product** (`backend/src/entities/product.entity.ts`)
```typescript
{
  _id: ObjectId,
  name: string,
  sku: string,
  price: number,
  currency: string,
  description: string,
  images: string[],        // Image URLs
  model3d: string,         // GLB/GLTF file URL
  category: ObjectId,      // Ref to Category
  collection: ObjectId,    // Ref to Collection
  isPublished: boolean,
  organizationId: string,
  createdAt: Date
}
```

**BlogPost** (`backend/src/entities/blog-post.entity.ts`)
```typescript
{
  _id: ObjectId,
  title: string,
  slug: string,           // URL-friendly
  content: string,        // HTML
  excerpt: string,
  featuredImage: string,
  status: 'draft' | 'published' | 'archived',
  tags: string[],
  seo: {
    title: string,
    description: string,
    keywords: string,
    ogImage: string
  },
  publishedAt: Date,
  createdAt: Date
}
```

**Menu** (`backend/src/entities/menu.entity.ts`)
```typescript
{
  _id: ObjectId,
  name: string,           // "Main Navigation"
  location: string,       // "header", "footer"
  items: MenuItem[],      // Nested menu structure
  isActive: boolean
}

interface MenuItem {
  id: string,
  label: string,
  url?: string,
  pageId?: string,        // Link to CMS page
  children?: MenuItem[],  // Nested items
  order: number
}
```

**Quotation** (`backend/src/entities/quotation.entity.ts`)
```typescript
{
  _id: ObjectId,
  clientName: string,
  clientEmail: string,
  items: QuotationItem[],
  totalAmount: number,
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED',
  validUntil: Date,
  organizationId: string
}
```

---

## 🔌 API Endpoints

### Racconti Backend: `http://localhost:3002/api`

**Catalogue** (`/api/catalogue`)
- `GET /products` - List all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /categories` - List categories
- `POST /categories` - Create category
- `GET /collections` - List collections
- `POST /collections` - Create collection

**CMS** (`/api/cms`)
- `GET /pages` - List pages
- `GET /pages/:id` - Get page
- `POST /pages` - Create page
- `PUT /pages/:id` - Update page
- `GET /blogs` - List blog posts
- `GET /blogs/:id` - Get blog post
- `POST /blogs` - Create blog post
- `PUT /blogs/:id` - Update blog post
- `GET /blog/slug/:slug` - Get blog by slug
- `GET /menus` - List menus
- `POST /menus` - Create menu
- `PUT /menus/:id` - Update menu
- `GET /menu/location/:location` - Get menu by location

**Quotations** (`/api/quotations`)
- `GET /` - List quotations
- `GET /:id` - Get quotation
- `POST /` - Create quotation
- `PUT /:id` - Update quotation
- `DELETE /:id` - Delete quotation

**Media** (`/api/cms/media`)
- `POST /upload` - Upload file (images, GLB, GLTF)
- `GET /:filename` - Get uploaded file

---

## ✅ Completed Features (~45%)

### Backend
- [x] Product, Category, Collection entities
- [x] Page, BlogPost, Menu entities
- [x] Quotation, EmailTemplate entities
- [x] Full CRUD APIs for all entities
- [x] File upload support (.glb, .gltf, images)
- [x] MongoDB integration with multi-tenant support
- [x] TypeORM repositories

### Frontend
- [x] Product List with premium Material Design
  - Card grid layout (responsive)
  - Edit buttons
  - 3D badges
  - Hover effects
- [x] Product Form with 3D upload
  - Route parameter detection for edit mode
  - Form validation
  - `<model-viewer>` integration
  - Auto-populated fields when editing
- [x] Blog List Component
  - Card grid with featured images
  - Status badges (draft/published)
  - Tags display
  - Edit buttons
- [x] Blog Editor Component
  - Full form with SEO fields
  - Auto-slug generation from title
  - Tags input (comma-separated)
  - Status selector
- [x] Quotation List
  - Professional table design
  - Color-coded status
  - View buttons
- [x] Quotation Form
  - Client details
  - Line items
  - Status workflow
- [x] Page List/Editor (CMS)
- [x] Theme system with CSS variables
- [x] Multi-brand configuration

---

## ⏳ Pending Features (~55%)

### High Priority
- [ ] **Client Portal**
  - Client dashboard UI
  - "My Quotations" view for clients
  - Accept/Reject quote buttons
  - PDF download
- [ ] **Quotation PDF Export**
  - Generate PDF from quotation data
  - Email quotation to client
- [ ] **Menu Builder UI**
  - Drag-and-drop menu editor
  - Nested menu item support
  - Link to pages/blogs
- [ ] **Category/Collection Management**
  - CRUD UI components
  - Product filtering by category/collection
- [ ] **Rich Text Editor**
  - Replace textarea with WYSIWYG (TinyMCE/Quill)
  - For blog content and page content

### Medium Priority
- [ ] **Media Manager Enhancement**
  - Grid view with thumbnails
  - File browser UI
  - Upload progress
  - File type filtering
- [ ] **Product SEO Fields**
  - Add SEO object to Product entity
  - Update Product Form
- [ ] **Visitor Analytics Widget**
  - Dashboard widget
  - Track page views
- [ ] **Email Templates UI**
  - Template list component
  - Template editor
  - Variable placeholders

### Lower Priority
- [ ] **Workflow Automation**
  - Workflow entity
  - Trigger system
  - Workflow builder UI
- [ ] **2FA Implementation**
- [ ] **Invite User Flow**
- [ ] **Lead Scoring System**
- [ ] **Bulk Product Import** (CSV)

---

## 🚀 Running the Project

### Prerequisites
```bash
# Install Node 22
nvm install 22
nvm use 22

# MongoDB must be running
# Default connection: mongodb://localhost:27017
```

### Development Mode
```bash
# Option 1: Run Racconti XRM
node start.js raccontixrm

# This starts:
# - Backend: localhost:3002
# - Frontend: localhost:4202
# - Database: racconti (MongoDB)

# Option 2: Manual start
cd backend && npm run start:dev    # Port 3002
cd frontend && ng serve --project=raccontixrm  # Port 4202
```

### Production Build
```bash
# Build backend
cd backend && npm run build

# Build frontend with SSR (disabled due to NG0401 error)
cd frontend && BRAND=raccontixrm npm run build

# Start with PM2
npm run pm2:start:raccontixrm
```

### Kill All Processes
```bash
npm run kill-all
```

---

## 🧪 Testing Strategy

### MCP Browser Testing
Use MCP (Model Context Protocol) browser for automated testing:

```javascript
// Example test flow
1. Navigate to http://localhost:4202/modules/catalogue
2. Verify product cards display
3. Click "Edit" on a product
4. Verify form loads with product data
5. Verify <model-viewer> displays 3D model
6. Navigate to /modules/quotations
7. Verify table shows quotations
8. Click "View" button
```

### Manual Testing Checklist
- [ ] Product CRUD operations
- [ ] 3D model upload and display
- [ ] Blog post creation with SEO
- [ ] Quotation create/edit
- [ ] Menu management
- [ ] File upload (.glb, images)
- [ ] Multi-tenant isolation

---

## 🎨 Design System

### Theme Variables (CSS)
```css
:root {
  --theme-primary: #4F46E5;      /* Indigo */
  --theme-secondary: #6B7280;    /* Gray */
  --theme-accent: #10B981;       /* Green */
  --theme-surface: #ffffff;
  --theme-background: #fafafa;
  --theme-on-surface: #212121;
}
```

### Component Patterns
- **Cards**: `rounded-xl shadow-sm hover:shadow-lg transition-shadow`
- **Buttons**: `px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700`
- **Forms**: `px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500`
- **Status Badges**: Color-coded with `ngClass`
  - Draft: yellow
  - Published/Sent: blue/green
  - Accepted: green
  - Declined/Archived: red/gray

---

## 🔧 Common Issues & Solutions

### Issue: SSR Build Fails with NG0401
**Cause**: Angular can't extract routes statically due to auth guards  
**Solution**: Disabled prerendering in `angular.json`
```json
{
  "prerender": false,  // Was true, causing errors
  "ssr": false         // Disabled SSR for now
}
```

### Issue: Blog list shows empty after creation
**Cause**: Frontend calling `localhost:4202/api` instead of backend `localhost:3002/api`  
**Solution**: Verify `brand.config.ts` has correct `apiUrl`:
```typescript
apiUrl: 'http://localhost:3002/api'  // Correct
```

### Issue: 3D Model not displaying
**Cause**: Missing `<model-viewer>` element or incorrect src URL  
**Solution**: 
1. Ensure `CUSTOM_ELEMENTS_SCHEMA` in component
2. Use `getFullUrl()` helper to construct full URL
3. Verify .glb file uploaded successfully

---

## 📋 Next Steps for AI Agent

To complete Racconti XRM to 100%, follow this order:

### Step 1: Client Portal (High Impact)
```bash
# Create files:
frontend/src/app/modules/client-portal/
├── client-portal.routes.ts
├── client-dashboard.component.ts    # Landing page for clients
├── my-quotations.component.ts       # List client's quotes
└── quotation-view.component.ts      # View/Accept/Reject quote
```

### Step 2: PDF Generation
```bash
# Install pdfmake
cd backend && npm install pdfmake

# Create:
backend/src/quotations/quotation-pdf.service.ts  # Generate PDF
backend/src/quotations/quotation.controller.ts   # Add GET /:id/pdf endpoint
```

### Step 3: Menu Builder UI
```bash
# Create:
frontend/src/app/modules/cms/components/menu-builder/
├── menu-list.component.ts
└── menu-editor.component.ts  # Drag-drop menu builder
```

### Step 4: Rich Text Editor
```bash
# Install TinyMCE or Quill
cd frontend && npm install @tinymce/tinymce-angular

# Update:
- blog-editor.component.ts
- page-editor.component.ts
```

### Step 5: Category/Collection UI
```bash
# Create:
frontend/src/app/modules/catalogue/components/
├── category-list.component.ts
├── category-form.component.ts
├── collection-list.component.ts
└── collection-form.component.ts
```

### Step 6: Comprehensive Testing
- Run MCP browser tests on all modules
- Verify multi-tenant data isolation
- Test all CRUD operations
- Validate 3D viewer on multiple products
- Test quotation workflow end-to-end

---

## 📁 Key Files Reference

### Backend
- `backend/src/app.module.ts` - Register all modules here
- `backend/src/entities/*.entity.ts` - Database models
- `backend/src/catalogue/catalogue.module.ts` - Product module
- `backend/src/cms/cms.module.ts` - CMS module (Pages/Blogs/Menus)
- `backend/src/quotations/quotations.module.ts` - Quote module

### Frontend
- `frontend/src/app/app.routes.ts` - Root routing
- `frontend/src/app/brand.config.ts` - API URL configuration
- `frontend/angular.json` - Build configuration per brand
- `frontend/src/app/modules/catalogue/catalogue.routes.ts` - Product routes
- `frontend/src/app/modules/cms/cms.routes.ts` - CMS routes (pages + blogs)
- `frontend/src/app/modules/quotations/quotations.routes.ts` - Quote routes

### Configuration
- `start.js` - Development launcher (sets up env vars)
- `ecosystem.config.js` - PM2 production config
- `package.json` - Scripts (kill-all, pm2:start:raccontixrm)

---

## 🎯 Success Criteria

Racconti XRM is complete when:
- ✅ All 11 modules from Excel spec have CRUD operations
- ✅ Client can log in, view quotations, accept/reject
- ✅ PDFs can be generated for quotations
- ✅ 3D product viewer works on all products
- ✅ Blog system with SEO fully functional
- ✅ Menu builder allows creating navigation menus
- ✅ All pages have premium Material Design
- ✅ MCP browser tests pass for all flows
- ✅ Multi-tenant isolation verified
- ✅ Production build succeeds without errors

---

## 📞 Quick Commands Cheat Sheet

```bash
# Development
node start.js raccontixrm          # Start everything
npm run kill-all                   # Stop everything
nvm use 22                         # Switch to Node 22

# Backend only
cd backend && npm run start:dev    # Dev server with watch
cd backend && npm run build        # Production build

# Frontend only
cd frontend && ng serve --project=raccontixrm  # Dev server
cd frontend && BRAND=raccontixrm ng build      # Production build

# Database
mongosh                            # Open MongoDB shell
use racconti                       # Switch to Racconti DB
db.products.find()                 # List products
db.blog_posts.find()               # List blog posts

# Testing
# Open MCP browser to test routes
http://localhost:4202/modules/catalogue
http://localhost:4202/modules/cms/blogs
http://localhost:4202/modules/quotations
```

---

**End of Master Documentation**  
**For questions or clarifications, refer to `/documentation/` folder or this master doc.**
