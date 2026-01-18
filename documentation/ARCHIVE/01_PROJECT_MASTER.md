# Bhuri-SAP & Racconti XRM - Project Master

**Last Updated**: 2026-01-13  
**Version**: 1.1 (Consolidated)  
**Purpose**: Centralized knowledge base for setup, architecture, and requirements.

---

## 🎯 Project Overview

**Bhuri-SAP** is a modular, multi-tenant Enterprise Resource Planning (ERP) platform. 
**Racconti XRM** is a specialized extension focused on visual-heavy, customer-facing businesses (furniture, real estate, high-end retail) requiring 3D visualization and content management.

### Key Differentiators (Racconti XRM)
- 3D product visualization (GLB/GLTF support)
- Integrated Content Management System (CMS)
- Product catalogue with collections and categories
- Quotation management with client portal

---

## 🏗️ System Architecture

### Tech Stack
- **Backend**: NestJS 10+ with TypeORM and MongoDB
- **Frontend**: Angular 20+ with Material UI and Tailwind CSS
- **Database**: MongoDB 6.0+ (Multi-tenant via database per brand)
- **3D Viewer**: `@google/model-viewer` web component
- **Node.js**: v22+ (Required)

### Multi-Tenant System
The platform supports multiple brands via dynamic configuration:
- **Brands**: `beax-rm` (Port 4200/3000), `true-process` (Port 4201/3001), `raccontixrm` (Port 4202/3002)
- **Launcher**: `start.js` configures and launches specific brands.
- **Data Isolation**: Each brand uses a separate MongoDB database.

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 22+
- MongoDB 6.0+
- PM2 (for production)

### Development Mode
```bash
# Option 1: Start Racconti XRM (Automatic)
node start.js raccontixrm

# Option 2: Manual Start
cd backend && npm run start:dev    # Starts on Port 3002
cd frontend && ng serve --project=raccontixrm  # Starts on Port 4202
```

### Initial Data Setup
Create a super admin user and role directly in MongoDB:
```javascript
// Switch to 'racconti' database
db.roles.insertOne({
  name: "Super Admin",
  type: "super_admin",
  description: "Full system access",
  permissionIds: [],
  createdAt: new Date()
});

db.users.insertOne({
  email: "admin@example.com",
  password: "bcrypt_hash_here",
  firstName: "Super",
  lastName: "Admin",
  isActive: true,
  roleIds: [role_id_here],
  createdAt: new Date()
});
```

---

## 📊 Database Schema Summary
*Detailed blueprint available in legacy `DATABASE_BLUEPRINT.md`.*

### Core Collections
- **Users**: Authentication and organization context.
- **Organizations**: Multi-tenant entity with brand-specific settings.
- **Modules**: Dynamic registry of active business functions.

### Racconti XRM Specialized Entities
- **Product**: Includes `model3d` (GLB URL), `sku`, `price`, `images`.
- **Quotation**: Links clients to products with status workflow (`DRAFT`, `SENT`, `ACCEPTED`, `DECLINED`).
- **BlogPost**: CMS content with `slug`, `content` (HTML), and `seo` metadata.
- **Menu**: Nested navigation structures for frontend display.

---

## 📋 Role Hierarchy
- **Super Admin**: Full system access, organization, and module management.
- **Admin**: Organization-level management and user control.
- **Manager/Staff**: Business module access based on department.
- **Client**: Access to **Client Portal** for viewing/accepting quotations.

---

## 🛠️ Development Workflow
1. **Module Creation**: Use NestJS CLI to generate backend modules and Angular CLI for frontend.
2. **Branding**: Update `brand.config.ts` in frontend for UI changes and `config.js` in root for backend ports.
3. **Testing**: Use MCP browser to verify routes and flows (e.g., `http://localhost:4202/modules/catalogue`).
4. **Builds**: Ensure SSR is handled or disabled if auth guards block static extraction (currently disabled).

---

## ✅ Success Criteria
- All 11 modules from the original Excel spec are functional.
- End-to-end 3D model flow (Upload -> Catalog -> Quote -> Client View).
- Full CMS control (Pages/Blogs/Menus).
- Multi-tenant isolation verified across all modules.
